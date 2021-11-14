import React from 'react';
import { Button, Icon } from 'react-bulma-components';

export default function RefreshButton(props) {
    return (<Button
        fullwidth={true}
        title={props.title}
        className='p-2 has-background-grey-light'
        disabled={props.isDisabled}
        onClick={props.handleClick}>
        {props.icon && <Icon align='left' size='large'>
            <i className={`${props.icon} is-size-3 has-text-black`}></i>
        </Icon>}
        {!props.icon && <img alt={props.alt} src={props.image}/>}
    </Button>);
}
