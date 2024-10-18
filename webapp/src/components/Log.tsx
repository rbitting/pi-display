import React, { useCallback, useEffect } from 'react';
import Headline from './Headline';

/** The initial number of log lines to display on page load */
const INITIAL_NUM_OF_LINES: number = 50;

/**
 * A component for displaying backend server logs
 * @returns The log component
 */
export default function Log(): JSX.Element {
  /**
   * Scrolls the viewport to the bottom of the page
   */
  const focusOnBottom = (): void => {
    document.getElementById('bottom-of-log-list')?.scrollIntoView({ behavior: 'smooth' });
  };

  // eslint-disable-next-line @typescript-eslint/typedef
  const showLogMessages = useCallback((messages: Array<string>): void => {
    let className: string;
    messages.forEach((line: string) => {
      const li: HTMLElement = document.createElement('li');
      const isSecondaryLogLine: boolean = line.trim().substring(0, 1) !== '[';
      if (line.length > 6 && line.substring(0, 7) === '[ERROR]') {
        className = 'has-text-danger';
      } else if (line.length > 6 && line.substring(0, 6) === '[WARN]') {
        className = 'has-text-warning';
      } else if (line.length > 1 && !isSecondaryLogLine) {
        className = '';
      }
      if (className) {
        li.classList.add(className);
      }
      // Indent secondary lines
      li.innerHTML = `${isSecondaryLogLine ? '  ' : ''}${line}`;
      // eslint-disable-next-line @typescript-eslint/typedef
      const list = document.getElementById('log-list');
      if (list) {
        list.append(li);
        focusOnBottom();
      }
    });
  }, []);

  useEffect(() => {
    // Create WebSocket connection
    const socket: WebSocket = new WebSocket(`ws://${window.location.hostname}:3000/api/logs/python/active`);

    // Connection opened
    socket.addEventListener('open', () => {
      // Print existing log
      fetch(`/api/logs/python/${INITIAL_NUM_OF_LINES}`)
        .then((data: Response) => data.json())
        // eslint-disable-next-line jsdoc/require-jsdoc
        .then((json: { message: string }) => {
          showLogMessages(json.message.split('\n'));
        });
    });

    // Print new incoming log messages
    socket.addEventListener('message', (event: MessageEvent<string>): void => {
      showLogMessages(event.data.replace(/\r/g, '').split('\n'));
    });

    return function cleanup(): void {
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
