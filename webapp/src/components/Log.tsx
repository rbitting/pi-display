import React, { useCallback, useEffect } from 'react';
import Headline from './Headline';

const INITIAL_NUM_OF_LINES = 100;

export default function Log() {
    function focusOnBottom() {
        document.getElementById('bottom-of-log-list')?.scrollIntoView({ behavior: 'smooth' });
    }

    const showLogMessages = useCallback((messages: Array<string>) => {
        let className: string;
        messages.forEach((line) => {
            const li = document.createElement('li');
            if (line.length > 6 && line.substring(0, 7) === '[ERROR]') {
                className = 'has-text-danger';
            } else if (line.length > 6 && line.substring(0, 6) === '[WARN]') {
                className = 'has-text-warning';
            } else if (line.length > 1 && line.substring(0, 1) === '[') {
                className = '';
            }
            if (className) {
                li.classList.add(className);
            }
            li.innerHTML = `${!className ? '&#9;' : ''}${line}`;
            const list = document.getElementById('log-list');
            if (list) {
                list.append(li);
                focusOnBottom();
            }
        });
    }, []);

    useEffect(() => {
        // Create WebSocket connection.
        const socket = new WebSocket(`ws://${window.location.hostname}:3000/api/logs/python/active`);

        // Connection opened
        socket.addEventListener('open', () => {
            // Print existing log
            fetch(`/api/logs/python/${INITIAL_NUM_OF_LINES}`)
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
            <ul id="log-list" />
            <span id="bottom-of-log-list" />
        </section>
    );
}
