import React, { useState } from 'react';
import SendMessageForm from './SendMessageForm';
import RefreshData from './RefreshData';
import DisplayStatus from './DisplayStatus';

export default function HomePage() {
    const [isProcessing, setIsProcessing] = useState(false);
    return (<div>
        <DisplayStatus isProcessing={isProcessing} setIsProcessing={setIsProcessing} />
        <RefreshData isProcessing={isProcessing} setIsProcessing={setIsProcessing} />
        <SendMessageForm isProcessing={isProcessing} setIsProcessing={setIsProcessing}/>
    </div>);
};
