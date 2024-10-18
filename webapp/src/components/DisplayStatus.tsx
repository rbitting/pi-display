import React, { useEffect, useState } from 'react';
import Headline from './Headline';
import { ProcessingProps } from './shared.types';

/**
 * Represents a message returned from the web socket
 */
interface WebSocketMessage {
  /** Whether there was an error */
  readonly isError: boolean;
  /** Whether the display is still processing */
  readonly isProcessing: boolean;
  /** A date-time string representing the last display refresh */
  readonly lastRefresh: string;
  /** The message from the web socket */
  readonly message: string;
}

/**
 * A component for display the current status of the Pi display
 * @returns The display status component
 */
export default function DisplayStatus({ isProcessing, setIsProcessing }: ProcessingProps): JSX.Element {
  const [lastRefresh, setLastRefresh] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Create WebSocket connection.
    const socket: WebSocket = new WebSocket(`ws://${window.location.hostname}:3000/api/display-status`);

    // Print new incoming log messages
    socket.addEventListener('message', (event: MessageEvent<string>) => {
      try {
        const json: WebSocketMessage = JSON.parse(event.data);
        setLastRefresh(json.lastRefresh);
        setIsError(json.isError);
        setMessage(json.message);
        setIsProcessing(json.isProcessing);
      } catch {
        console.error('Could not parse data');
        setIsProcessing(false);
      }
    });

    return function cleanup(): void {
      socket.close();
    };
  }, [setIsProcessing]);

  let className: string = 'has-text-success';
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
