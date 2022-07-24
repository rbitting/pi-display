import React, { useEffect, useState } from 'react';
import Headline from './Headline';
import { ProcessingProps } from '../prop-types';

export default function DisplayStatus({ isProcessing, setIsProcessing }: ProcessingProps) {
    const [lastRefresh, setLastRefresh] = useState('');
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Create WebSocket connection.
        const socket = new WebSocket(`ws://${window.location.hostname}:3000/api/display-status`);

        // Print new incoming log messages
        socket.addEventListener('message', (event) => {
            try {
                const json = JSON.parse(event.data);
                setLastRefresh(json.lastRefresh);
                setIsError(json.isError);
                setMessage(json.message);
                setIsProcessing(json.isProcessing);
            } catch {
                console.error('Could not parse data');
                setIsProcessing(false);
            }
        });

        return function cleanup() {
            socket.close();
        };
    }, [setIsProcessing]);

    let className = 'has-text-success';
    if (isProcessing) {
        className = 'has-text-warning';
    } else if (isError) {
        className = 'has-text-danger';
    }

    return (
        <section className="mb-6 display-status">
            <Headline title="Current Status" icon="fas fa-info-circle" isProcessing={isProcessing} />
            <ul>
                <li>Time: {lastRefresh}</li>
                <li>
                    Status: <span className={className}>{message}</span>
                </li>
            </ul>
        </section>
    );
}
