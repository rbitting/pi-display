import React from 'react';
import loadingImg from '../assets/loading.svg';

/**
 * A component for displaying a loading spinner
 * @returns The loading spinner component
 */
export default function Loading(): JSX.Element {
  return <img className="loading-spinner" src={loadingImg as string} alt="Loading" />;
}
