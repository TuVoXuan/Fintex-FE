import mqtt, { MqttClient } from 'mqtt';
import { createContext, useContext, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import { addMessage } from '../redux/reducers/conversation-slice';
import { selectUser } from '../redux/reducers/user-slice';
import { toastSuccess } from '../util/toast';

export const MQTTContext = createContext<MqttClient | null>(null);

interface Props {
    children: React.ReactNode;
}

export const MQTTProvider = ({ children }: Props) => {
    const mqttRef = useRef<MqttClient | null>(null);
    const dispatch = useAppDispatch();
    const sUser = useAppSelector(selectUser);
    const userId = sUser.data?._id || '';

    if (!mqttRef.current && sUser.isLogin && userId) {
        console.log('connect to mqtt broker');
        mqttRef.current = mqtt.connect(`${process.env.MQTT_BROKER}`, {
            clean: false,
            clientId: 'mqttjs_' + Math.floor(Math.random() * 100000000),
        });
        mqttRef.current.subscribe(`${sUser.data?._id}/chat`, { qos: 1 }, function (err) {
            console.log('error subscribe: ', err);
        });
        mqttRef.current.on('message', (topic, payload) => {
            if (topic === `${userId}/chat`) {
                const data = JSON.parse(payload.toString());
                dispatch(addMessage(JSON.parse(data.data)));
            }
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

    return <MQTTContext.Provider value={mqttRef.current}>{children}</MQTTContext.Provider>;
};

export const useMQTT = () => {
    const mqttClient = useContext(MQTTContext);
    // console.log("mqttClient: ", mqttClient);
    return mqttClient;
};
