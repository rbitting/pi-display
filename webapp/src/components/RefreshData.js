import React from 'react';
import { Columns } from 'react-bulma-components';
import Headline from './Headline';
//import piholePng from '../assets/pihole.png';
import RefreshButton from './RefreshButton';

const REFRESH_ALL_PATH = '/refresh/all';
const CLEAR_ALL_PATH = '/refresh/clear';
/* const REFRESH_CRYPTO_PATH = './refresh/crypto';
const REFRESH_WEATHER_PATH = './refresh/weather';
const REFRESH_NETWORK_PATH = './refresh/network';
const REFRESH_PIHOLE_PATH = './refresh/pihole';
const REFRESH_NEWS_PATH = './refresh/news';
const REFRESH_SEPTA_PATH = './refresh/septa'; */

export default function RefreshData(props) {
    async function postToEndpoint(path) {
        props.setIsProcessing(true);
        const response = await fetch(path, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        })
            .then(data => props.setIsProcessing(false))
            .catch(err => {
                console.error(err);
                props.setIsProcessing(false);
            });

        console.log(response);
    }
    return (<section className='mb-6'>
        <Headline title='Display Commands' icon='fas fa-terminal' />
        <Columns className='mt-3' breakpoint='mobile' mobile={{ gap: '1' }}>
            <Columns.Column mobile={{ size: 6 }} tablet={{ size: 6 }} desktop={{ size: 3 }}>
                <RefreshButton
                    isDisabled={props.isProcessing}
                    icon='fas fa-sync-alt'
                    title='Refresh Display'
                    text='Refresh'
                    handleClick={() => postToEndpoint(REFRESH_ALL_PATH)} />
            </Columns.Column>
            <Columns.Column mobile={{ size: 6 }} tablet={{ size: 6 }} desktop={{ size: 3 }}>
                <RefreshButton
                    isDisabled={props.isProcessing}
                    icon='fas fa-eraser'
                    title='Clear Display'
                    text='Clear'
                    handleClick={() => postToEndpoint(CLEAR_ALL_PATH)} />
            </Columns.Column>
        </Columns>
        {/* <Columns breakpoint='mobile' mobile={{ gap: '1' }}>
            <Columns.Column mobile={{ size: 2 }}>
                <RefreshButton
                    isDisabled={isLoading}
                    icon='fab fa-bitcoin'
                    title='Refresh Cypto Prices'
                    handleClick={() => postToEndpoint(REFRESH_CRYPTO_PATH)} />
            </Columns.Column>
            <Columns.Column mobile={{ size: 2 }}>
                <RefreshButton
                    isDisabled={isLoading}
                    icon='fas fa-cloud-sun'
                    title='Refresh Weather'
                    handleClick={() => postToEndpoint(REFRESH_WEATHER_PATH)} />
            </Columns.Column>
            <Columns.Column mobile={{ size: 2 }}>
                <RefreshButton
                    isDisabled={isLoading}
                    icon='fas fa-wifi'
                    title='Refresh Network'
                    handleClick={() => postToEndpoint(REFRESH_NETWORK_PATH)} />
            </Columns.Column>
            <Columns.Column mobile={{ size: 2 }}>
                <RefreshButton
                    isDisabled={isLoading}
                    image={piholePng}
                    alt='Pi-Hole'
                    title='Refresh Pi-Hole'
                    handleClick={() => postToEndpoint(REFRESH_PIHOLE_PATH)} />
            </Columns.Column>
            <Columns.Column mobile={{ size: 2 }}>
                <RefreshButton
                    isDisabled={isLoading}
                    icon='far fa-newspaper'
                    title='Refresh News'
                    handleClick={() => postToEndpoint(REFRESH_NEWS_PATH)} />
            </Columns.Column>
            <Columns.Column mobile={{ size: 2 }}>
                <RefreshButton
                    isDisabled={isLoading}
                    icon='fas fa-bus-alt'
                    title='Refresh Septa'
                    handleClick={() => postToEndpoint(REFRESH_SEPTA_PATH)} />
            </Columns.Column>
        </Columns> */}
    </section>);
}
