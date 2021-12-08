import React from 'react';
import SendMessageForm from './SendMessageForm';
import RefreshData from './RefreshData';
import DisplayStatus from './DisplayStatus';

export default function HomePage() {
    return (<div>
        <DisplayStatus />
        <RefreshData />
        <SendMessageForm/>
    </div>);
};
