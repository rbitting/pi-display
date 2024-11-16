import React, { useState } from 'react';
import { Columns } from 'react-bulma-components';
import Headline from './Headline';
import RefreshButton from './RefreshButton';
import { ProcessingProps } from './shared.types';

/** The endpoint path to clear the display */
const CLEAR_ALL_PATH: string = '/api/refresh/clear';

/** The endpoint path to reboot the display */
const REBOOT_PATH: string = '/api/reboot';

/** The endpoint path to refresh the display */
const REFRESH_ALL_PATH: string = '/api/refresh/all';

/**
 * A component for allowing various display actions
 * @returns The refresh data component
 */
export default function RefreshData({ isProcessing, setIsProcessing }: ProcessingProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Sends a POST request to the specified endpoint
   * @param path The path to the endpoint to call
   */
  const postToEndpoint = async (path: string): Promise<void> => {
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
      .catch((err: Error) => {
        console.error(err);
        setIsProcessing(false);
        setIsLoading(false);
      });
  };

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
