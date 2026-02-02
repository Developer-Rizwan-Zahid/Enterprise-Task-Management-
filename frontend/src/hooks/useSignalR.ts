import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export const useSignalR = (onUpdate: (message: string) => void) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5048/hub/notifications') // Adjust port if necessary
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Connected to SignalR Hub');
                    connection.on('ReceiveTaskUpdate', (message: string) => {
                        console.log('Received Task Update:', message);
                        onUpdate(message);
                    });
                })
                .catch(error => console.error('SignalR Connection Error: ', error));

            return () => {
                connection.off('ReceiveTaskUpdate');
                connection.stop();
            };
        }
    }, [connection, onUpdate]);

    return connection;
};
