import React, { useState } from 'react';
import { Columns } from 'react-bulma-components';
import Headline from './Headline';
import RefreshButton from './RefreshButton';
import { ProcessingProps } from '../prop-types';

const REFRESH_ALL_PATH = '/api/refresh/all';
const CLEAR_ALL_PATH = '/api/refresh/clear';
const REBOOT_PATH = '/api/reboot';

export default function RefreshData({ isProcessing, setIsProcessing }: ProcessingProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function postToEndpoint(path: string) {
        setIsProcessing(true);
        setIsLoading(true);
        await fetch(path, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        })
            .then(() => {
                setIsProcessing(false);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsProcessing(false);
                setIsLoading(false);
            });
    }
    return (
        <section className="mb-6">
            <Headline title="Display Commands" icon="fas fa-terminal" />
            <Columns className="mt-3" breakpoint="mobile" mobile={{ gap: '1' }}>
                <Columns.Column mobile={{ size: 12 }} tablet={{ size: 6 }} desktop={{ size: 3 }}>
                    <RefreshButton
                        isDisabled={isLoading || isProcessing}
                        icon="fas fa-sync-alt"
                        title="Refresh Display"
                        text="Refresh"
                        handleClick={() => postToEndpoint(REFRESH_ALL_PATH)}
                    />
                </Columns.Column>
                <Columns.Column mobile={{ size: 12 }} tablet={{ size: 6 }} desktop={{ size: 3 }}>
                    <RefreshButton
                        isDisabled={isLoading || isProcessing}
                        icon="fas fa-eraser"
                        title="Clear Display"
                        text="Clear"
                        handleClick={() => postToEndpoint(CLEAR_ALL_PATH)}
                    />
                </Columns.Column>
                <Columns.Column mobile={{ size: 12 }} tablet={{ size: 6 }} desktop={{ size: 3 }}>
                    <RefreshButton
                        isDisabled={isLoading || isProcessing}
                        icon="fas fa-power-off"
                        title="Reboot display"
                        text="Reboot"
                        handleClick={() => postToEndpoint(REBOOT_PATH)}
                        verifyOnClick
                    />
                </Columns.Column>
            </Columns>
        </section>
    );
}
