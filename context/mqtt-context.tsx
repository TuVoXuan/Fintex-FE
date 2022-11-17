import mqtt, { MqttClient } from 'mqtt';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import { seenMessage } from '../redux/actions/conversation-action';
import { addMessage, seen } from '../redux/reducers/conversation-slice';
import { selectUser } from '../redux/reducers/user-slice';
import { toastError, toastSuccess } from '../util/toast';

type MqttType = {
    mqttClient: MqttClient | null;
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
                if (activedConversation.current === message.conversationId) {
                    try {
                        await dispatch(
                            seenMessage({
                                messageId: message._id,
                                conversationId: message.conversationId,
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
        <MQTTContext.Provider value={{ mqttClient: mqttRef.current, setConversation }}>{children}</MQTTContext.Provider>
    );
};

export const useMQTT = () => {
    const mqtt = useContext(MQTTContext);
    // console.log("mqttClient: ", mqttClient);
    return mqtt;
};
