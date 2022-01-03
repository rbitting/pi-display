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
}

function RefreshButton({ title, isDisabled, handleClick, icon, alt, image, text }: ButtonProps) {
    return (
        <Button
            fullwidth
            title={title}
            className="p-2 has-background-grey-light is-size-5"
            disabled={isDisabled}
            onClick={handleClick}
        >
            {icon && <i className={`${icon} has-text-black btn-icon mr-4`} />}
            {!icon && <img alt={alt} src={image} />}
            {text}
        </Button>
    );
}

RefreshButton.defaultProps = {
    title: '',
    icon: '',
    alt: '',
    image: ''
};

export default RefreshButton;
