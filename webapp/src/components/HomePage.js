import React from 'react';
import SendMessageForm from './SendMessageForm';
import RefreshData from './RefreshData';

export default function HomePage() {
    return (<div>
        <RefreshData />
        <SendMessageForm/>
    </div>);
};
