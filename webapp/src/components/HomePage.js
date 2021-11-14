import React, { useState } from 'react';
import { Columns, Button, Icon } from 'react-bulma-components';
import piholePng from '../assets/pihole.png';
import Loading from './Loading';
import SendMessageForm from './SendMessageForm';

const REFRESH_CRYPTO_PATH = './refresh/crypto';
const REFRESH_WEATHER_PATH = './refresh/weather';
const REFRESH_NETWORK_PATH = './refresh/network';
const REFRESH_PIHOLE_PATH = './refresh/pihole';
const REFRESH_NEWS_PATH = './refresh/news';

export default function HomePage() {
    const [buttonResult, setButtonResult] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function postToEndpoint(path) {
        setButtonResult('');
        setIsLoading(true);
        const response = await fetch(path, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        })
            .then(data => data.json())
            .then(data => {
                setIsError(data.code !== 200);
                setButtonResult(data.message);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsError(true);
                setButtonResult(err);
                setIsLoading(false);
            });

        console.log(response);
    }
    return (<div>
        <section className='mb-5'>
            <h1 className='title is-2'>Refresh Data</h1>
            <Columns breakpoint="mobile">
                <Columns.Column mobile={{ size: 'is-one-fifth' }}>
                    <Button
                        fullwidth={true}
                        title="Refresh Cypto Prices"
                        className={'p-2 has-background-grey-light'}
                        disabled={isLoading}
                        onClick={() => postToEndpoint(REFRESH_CRYPTO_PATH)}>
                        <Icon align='left' size='large'>
                            <i className="fab fa-bitcoin is-size-3 has-text-black"></i>
                        </Icon>
                    </Button>
                </Columns.Column>
                <Columns.Column mobile={{ size: 'is-one-fifth' }}>
                    <Button
                        fullwidth={true}
                        title='Refresh Weather'
                        className='p-2 has-background-grey-light'
                        disabled={isLoading}
                        onClick={() => postToEndpoint(REFRESH_WEATHER_PATH)}>
                        <Icon align='left' size='large'>
                            <i className="fas fa-cloud-sun is-size-3 has-text-black"></i>
                        </Icon>
                    </Button>
                </Columns.Column>
                <Columns.Column mobile={{ size: 'is-one-fifth' }}>
                    <Button
                        fullwidth={true}
                        title='Refresh Network'
                        className='p-2 has-background-grey-light'
                        disabled={isLoading}
                        onClick={() => postToEndpoint(REFRESH_NETWORK_PATH)}>
                        <Icon align='left' size='large'>
                            <i className="fas fa-wifi is-size-3 has-text-black"></i>
                        </Icon>
                    </Button>
                </Columns.Column>
                <Columns.Column mobile={{ size: 'is-one-fifth' }}>
                    <Button
                        fullwidth={true}
                        title='Refresh Pi-Hole'
                        className='p-2 has-background-grey-light'
                        disabled={isLoading}
                        onClick={() => postToEndpoint(REFRESH_PIHOLE_PATH)}>
                        <Icon align='left' size='large'>
                            <img alt='Pi-hole' src={piholePng}/>
                        </Icon>
                    </Button>
                </Columns.Column>
                <Columns.Column mobile={{ size: 'is-one-fifth' }}>
                    <Button
                        fullwidth={true}
                        title='Refresh News'
                        className='p-2 has-background-grey-light'
                        disabled={isLoading}
                        onClick={() => postToEndpoint(REFRESH_NEWS_PATH)}>
                        <Icon align='left' size='large'>
                            <i className="far fa-newspaper is-size-3 has-text-black"></i>
                        </Icon>
                    </Button>
                </Columns.Column>
            </Columns>
            <div className='min-height-60'>
                {isLoading && <Loading />}
                <p className={isError ? 'has-text-danger' : 'has-text-success'}>{buttonResult}</p>
            </div>
        </section>
        <SendMessageForm/>
    </div>);
};
