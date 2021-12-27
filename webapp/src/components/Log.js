import React, { useEffect } from 'react';
import Headline from './Headline';

export default function Log() {
    function showLogMessages(messages) {
        messages.forEach((line) => {
            const li = document.createElement('li');
            li.innerText = line;
            document.getElementById('log-list').append(li);
        });
    }

    useEffect(function () {
        // Create WebSocket connection.
        const socket = new WebSocket('ws://localhost:3000/logs/python/active');

        // Connection opened
        socket.addEventListener('open', function() {
            socket.send('Hello Server!');

            // Print existing log
            fetch('/logs/python')
                .then(data => data.json())
                .then(json => {
                    showLogMessages(json.message.split('\n'));
                });
        });

        // Print new incoming log messages
        socket.addEventListener('message', function (event) {
            console.log('Message from server ', event.data);
            showLogMessages(event.data.replace(/\r/g, '').split('\n'));
        });

        return function cleanup() {
            socket.close();
        };
    }, []);

    return (
        <section>
            <Headline title="Log" icon="fas fa-file-code" />
            <div>
                <ul id="log-list"></ul>
            </div>
        </section>
    );
}
