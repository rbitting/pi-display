import React from 'react';
import loadingImg from '../assets/loading.svg';

export default function Loading() {
  return <img className="loading-spinner" src={loadingImg} alt="Loading" />;
}
