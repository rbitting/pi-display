import React, { useEffect, useState } from 'react';

export default function DisplayStatus() {
    const [lastRefresh, setLastRefresh] = useState('');
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/display-status')
            .then(data => data.json())
            .then(json => {
                setLastRefresh(json.lastRefresh);
                setIsError(json.isError);
                setMessage(json.message);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (<section className='mb-5'>
        <h1 className='title is-size-2-desktop'>Current Status</h1>
        <ul>
            <li>Last Refresh Time: {lastRefresh}</li>
            <li>
                Last Refresh Status:{' '}
                <span className={isError ? 'has-text-danger' : 'has-text-success'}>
                    {message}
                </span>
            </li>
        </ul>
    </section>);
}
