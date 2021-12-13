import React from 'react';
import Loading from './Loading';

export default function Headline(props) {
    return <div className='is-flex mb-3'>
        {!props.isProcessing && <span className='is-flex is-flex-direction-column is-justify-content-center mr-4'>
            <i className={`is-size-4-mobile is-size-3-tablet is-size-3-desktop ${props.icon}`}></i>
        </span>}
        {props.isProcessing && <span className='mr-3'><Loading /></span>}
        <h1 className={`title is-size-4-mobile is-size-3-tablet is-size-2-desktop mb-0 ${props.extraEl ? 'mr-4' : ''}`}>{props.title}</h1>
        {props.extraEl}
    </div>;
};
