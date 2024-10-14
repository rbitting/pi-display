import React, { useState } from 'react';
import DisplayStatus from './DisplayStatus';
import RefreshData from './RefreshData';
import SendImageForm from './SendImageForm';
import SendMessageForm from './SendMessageForm';

export default function HomePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  return (
    <>
      <DisplayStatus isProcessing={isProcessing} setIsProcessing={setIsProcessing} />
      <RefreshData isProcessing={isProcessing} setIsProcessing={setIsProcessing} />
      <SendMessageForm isProcessing={isProcessing} setIsProcessing={setIsProcessing} />
      <SendImageForm isProcessing={isProcessing} setIsProcessing={setIsProcessing} />
    </>
  );
}
