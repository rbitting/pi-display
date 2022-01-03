import React from 'react';
import Loading from './Loading';

interface HeadlineProps {
    readonly icon: string;
    readonly isProcessing?: boolean;
    readonly title: string;
}

function Headline({ icon, isProcessing, title }: HeadlineProps) {
    return (
        <div className="is-flex mb-3">
            {!isProcessing && (
                <span className="is-flex is-flex-direction-column is-justify-content-center mr-4">
                    <i className={`is-size-4-mobile is-size-3-tablet is-size-3-desktop ${icon}`} />
                </span>
            )}
            {isProcessing && (
                <span className="mr-3">
                    <Loading />
                </span>
            )}
            <h1 className="title is-size-4-mobile is-size-3-tablet is-size-2-desktop mb-0">{title}</h1>
        </div>
    );
}

Headline.defaultProps = {
    isProcessing: false
};

export default Headline;
