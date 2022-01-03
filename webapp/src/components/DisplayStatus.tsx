import React, { useCallback, useEffect, useState } from 'react';
import Headline from './Headline';
import { ProcessingProps } from '../prop-types';

export default function DisplayStatus({ isProcessing, setIsProcessing }: ProcessingProps) {
    const [lastRefresh, setLastRefresh] = useState('');
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');

    const getDisplayStatus = useCallback(() => {
        fetch('/display-status')
            .then((data) => data.json())
            .then((json) => {
                setLastRefresh(json.lastRefresh);
                setIsError(json.isError);
                setMessage(json.message);
                setIsProcessing(json.isProcessing);
            })
            .catch((error) => {
                console.error(error);
                setIsProcessing(false);
            });
    }, [setLastRefresh, setIsError, setMessage, setIsProcessing]);

    useEffect(() => {
        const interval = setInterval(getDisplayStatus, 5000); // Get status every 5 seconds
        return () => {
            clearInterval(interval); // Stop interval on unmount
        };
    }, [getDisplayStatus]);

    let className = 'has-text-success';
    if (isProcessing) {
        className = 'has-text-warning';
    } else if (isError) {
        className = 'has-text-danger';
    }

    useEffect(() => getDisplayStatus(), [isProcessing, getDisplayStatus]);

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
