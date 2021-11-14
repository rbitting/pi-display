import React from 'react';
import loadingGif from '../assets/loading.gif';

export default function Loading() {
    return <img className='loading-spinner' src={loadingGif} alt='Loading'/>;
}
