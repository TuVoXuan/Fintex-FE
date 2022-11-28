import mqtt, { MqttClient } from 'mqtt';
import { createContext, MutableRefObject, useContext, useEffect, useRef } from 'react';
import APP_PATH from '../constants/app-path';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import { seenMessage } from '../redux/actions/conversation-action';
import { addMessage, removeConversation, removeParticipant, seen } from '../redux/reducers/conversation-slice';
import { selectUser } from '../redux/reducers/user-slice';
import { toastError } from '../util/toast';

type MqttType = {
    mqttClient: MqttClient | null;
    activedConversation: MutableRefObject<string>;
    setConversation: (value: string) => void;
};

export const MQTTContext = createContext<MqttType | null>(null);

interface Props {
    children: React.ReactNode;
}

export const MQTTProvider = ({ children }: Props) => {
    const mqttRef = useRef<MqttClient | null>(null);
    const dispatch = useAppDispatch();
    const sUser = useAppSelector(selectUser);
    const userId = sUser.data?._id || '';
    const activedConversation = useRef<string>('');

    const setConversation = (value: string) => {
        activedConversation.current = value;
    };

    const handleTopic = async (topic: string, payload: Buffer) => {
        const data = JSON.parse(payload.toString());
        let message;
        switch (topic) {
            case `${userId}/chat`:
                message = JSON.parse(data.data) as IMessageCreateRes;

                dispatch(addMessage(message));
                if (
                    activedConversation.current === message.conversationId &&
                    window.location.pathname === APP_PATH.CHAT
                ) {
                    try {
                        await dispatch(
                            seenMessage({
                                messageId: message._id,
                                conversationId: message.conversationId,
                                subMessageId: message.message[0]._id,
                            }),
                        );
                    } catch (error) {
                        console.log('error: ', error);
                    }
                }
                break;
            case `${userId}/chat/seen-message`:
                message = JSON.parse(data.data) as ISeenMessage;
                if (activedConversation.current === message.conversationId) {
                    try {
                        dispatch(seen(message));
                    } catch (error) {
                        console.log('error: ', error);
                    }
                }
                break;
            case `${userId}/chat/system-message`:
                try {
                    message = JSON.parse(data.data) as IEditMemberConvRes;
                    if (typeof message.member === 'string') {
                        if (sUser.data?._id === message.member) {
                            dispatch(removeConversation(message.conversationId));
                        } else {
                            dispatch(removeParticipant(message));
                        }
                    }
                } catch (error) {
                    toastError((error as IResponseError).error);
                }
                break;
            default:
                break;
        }
    };

    if (!mqttRef.current && sUser.isLogin && userId) {
        console.log('connect to mqtt broker');
        mqttRef.current = mqtt.connect(`${process.env.MQTT_BROKER}`, {
            clean: false,
            clientId: 'mqttjs_' + Math.floor(Math.random() * 100000000),
        });
        mqttRef.current.subscribe(`${sUser.data?._id}/chat`, { qos: 1 }, function (err) {
            console.log('error subscribe: ', err);
        });
        mqttRef.current.subscribe(`${sUser.data?._id}/chat/seen-message`, { qos: 1 }, function (err) {
            console.log('error subscribe: ', err);
        });
        mqttRef.current.subscribe(`${sUser.data?._id}/chat/system-message`, { qos: 1 }, function (err) {
            console.log('error subscribe: ', err);
        });
        mqttRef.current.on('message', (topic: string, payload: Buffer, packet: mqtt.IPublishPacket) => {
            handleTopic(topic, payload);
        });
    }

    useEffect(() => {
        return () => {
            if (mqttRef.current) {
                mqttRef.current.end();
                mqttRef.current = null;
            }
        };
    }, []);

    return (
        <MQTTContext.Provider value={{ mqttClient: mqttRef.current, activedConversation, setConversation }}>
            {children}
        </MQTTContext.Provider>
    );
};

export const useMQTT = () => {
    const mqtt = useContext(MQTTContext);
    // console.log("mqttClient: ", mqttClient);
    return mqtt;
};
