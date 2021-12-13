import React from 'react';
import { Form } from 'react-bulma-components';

export default function DisplayTimeOptions(props) {
    return <Form.Field className='mb-5 is-horizontal'>
        <Form.Label className='mr-3'>Display for:</Form.Label>
        <Form.Control>
            {props.times.map(time => {
                return <Form.Radio
                    checked={props.value === time.value}
                    className='mr-3'
                    key={props.id + time.value}
                    name={`time-to-display${props.id}`}
                    onChange={(e) => props.handleChange(e.target.value)}
                    value={time.value} >
                    {time.label}
                </Form.Radio>;
            })}
        </Form.Control>
    </Form.Field>;
};
