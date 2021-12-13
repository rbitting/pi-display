import React from 'react';
import { Button } from 'react-bulma-components';

export default function RefreshButton(props) {
    return (<Button
        fullwidth={true}
        title={props.title}
        className='p-2 has-background-grey-light is-size-5'
        disabled={props.isDisabled}
        onClick={props.handleClick}>
        {props.icon && <i className={`${props.icon} has-text-black btn-icon mr-4`}></i>}
        {!props.icon && <img alt={props.alt} src={props.image}/>}
        {props.text}
    </Button>);
}
