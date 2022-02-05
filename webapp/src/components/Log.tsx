import React, { useCallback, useEffect } from 'react';
import Headline from './Headline';

export default function Log() {
    function focusOnBottom() {
        document.getElementById('bottom-of-log-list')?.scrollIntoView({ behavior: 'smooth' });
    }

    const showLogMessages = useCallback((messages: Array<string>) => {
        messages.forEach((line) => {
            const li = document.createElement('li');
            li.innerText = line;
            const list = document.getElementById('log-list');
            if (list) {
                list.append(li);
                focusOnBottom();
            }
        });
    }, []);

    useEffect(() => {
        // Create WebSocket connection.
        const socket = new WebSocket(`ws://${window.location.hostname}:3000/logs/python/active`);

        // Connection opened
        socket.addEventListener('open', () => {
            // Print existing log
            fetch('/logs/python')
                .then((data) => data.json())
                .then((json) => {
                    showLogMessages(json.message.split('\n'));
                });
        });

        // Print new incoming log messages
        socket.addEventListener('message', (event) => {
            // eslint-disable-next-line no-console
            console.log('Message from server ', event.data);
            showLogMessages(event.data.replace(/\r/g, '').split('\n'));
        });

        return function cleanup() {
            socket.close();
        };
    }, [showLogMessages]);

    return (
        <section>
            <Headline title="Log" icon="fas fa-file-code" />
            <div>
                <ul id="log-list" />
                <span id="bottom-of-log-list" />
            </div>
        </section>
    );
}
