import React, { useState } from 'react';
import DisplayStatus from './DisplayStatus';
import RefreshData from './RefreshData';
import SendImageForm from './SendImageForm';
import SendMessageForm from './SendMessageForm';

/**
 * A component for the homepage of the app
 * @returns The homepage component
 */
export default function HomePage(): JSX.Element {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  return (
    <>
      <DisplayStatus isProcessing={isProcessing} setIsProcessing={setIsProcessing} />
      <RefreshData isProcessing={isProcessing} setIsProcessing={setIsProcessing} />
      <SendMessageForm isProcessing={isProcessing} setIsProcessing={setIsProcessing} />
      <SendImageForm isProcessing={isProcessing} setIsProcessing={setIsProcessing} />
    </>
  );
}
