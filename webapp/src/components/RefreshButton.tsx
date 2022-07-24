import React from 'react';
import { Button } from 'react-bulma-components';

interface ButtonProps {
    readonly handleClick: () => void;
    readonly isDisabled: boolean;
    readonly text: string;
    readonly alt?: string;
    readonly icon?: string;
    readonly image?: string;
    readonly title?: string;
    readonly verifyOnClick?: boolean;
}

function RefreshButton({
    title = '',
    isDisabled,
    handleClick,
    icon = '',
    alt = '',
    image = '',
    text,
    verifyOnClick = false
}: ButtonProps) {
    return (
        <Button
            fullwidth
            color={verifyOnClick ? 'danger' : 'grey-light'}
            title={title}
            className="p-2 is-size-5"
            disabled={isDisabled}
            onClick={handleClick}
        >
            {icon && <i className={`${icon} ${verifyOnClick ? 'has-text-white' : 'has-text-black'} btn-icon mr-4`} />}
            {!icon && <img alt={alt} src={image} />}
            {text}
        </Button>
    );
}

export default RefreshButton;
