import React, { useEffect, useState } from 'react';
import Headline from './Headline';

export default function DisplayStatus(props) {
    const [lastRefresh, setLastRefresh] = useState('');
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');

    function getDisplayStatus() {
        return fetch('/display-status')
            .then(data => data.json())
            .then(json => {
                setLastRefresh(json.lastRefresh);
                setIsError(json.isError);
                setMessage(json.message);
                props.setIsProcessing(json.isProcessing);
            })
            .catch(error => {
                console.error(error);
                props.setIsProcessing(false);
            });
    }

    useEffect(() => {
        const interval = setInterval(getDisplayStatus, 5000); // Get status every 5 seconds
        return () => {
            clearInterval(interval); // Stop interval on unmount
        };
    }, []);

    useEffect(() => getDisplayStatus(), [props.isProcessing]);

    const className = props.isProcessing ? 'has-text-warning' : (isError ? 'has-text-danger' : 'has-text-success');

    return (<section className='mb-6 display-status'>
        <Headline title="Current Status" icon="fas fa-info-circle" isProcessing={props.isProcessing} />
        <ul>
            <li>Time: {lastRefresh}</li>
            <li>
                Status:{' '}
                <span className={className}>
                    {message}
                </span>
            </li>
        </ul>
    </section>);
}
