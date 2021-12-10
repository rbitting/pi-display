import React, { useState } from 'react';
import { Form, Icon, Button } from 'react-bulma-components';

const MIN_CHARS = 1;
const MAX_CHARS = 100;
const ENDPOINT = '/sendmessage';

export default function SendMessageForm(props) {
    const [message, setMessage] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isSubmitError, setIsSubmitError] = useState(false);
    const [formResponse, setFormResponse] = useState('');

    const handleChange = (e) => {
        const val = e.target.value;
        const len = val.length;
        if (len > MAX_CHARS) {
            return false;
        }
        setMessage(val);
        setIsValid(len >= MIN_CHARS && len <= MAX_CHARS);
        setFormResponse('');
        setIsSubmitError(false);
    };

    const handleSubmit = async (e) => {
        props.setIsProcessing(true);
        if (isValid) {
            const response = await fetch(ENDPOINT, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({ message: message })
            })
                .catch(err => {
                    console.log(err);
                    setIsSubmitError(true);
                    setFormResponse(`Could not fetch ${ENDPOINT}. ${err}`);
                });

            const status = response.status;
            if (status === 200) {
                const json = await response.json();
                setFormResponse(`Message sent: '${json.data}'`);
                setMessage('');
                setIsValid(false);
            } else {
                setIsSubmitError(true);
                if (status === 404) {
                    setFormResponse(`404 '${ENDPOINT}' endpoint not found. Please check that the server is running.'`);
                } else {
                    try {
                        const json = await response.json();
                        setFormResponse(json.message);
                    } catch (e) {
                        console.log(e);
                        setFormResponse(`${status} ${response.statusText}`);
                    }
                }
            }
            props.setIsProcessing(false);
        }
    };
    return (<section>
        <h1 className='title is-size-2-desktop mb-2'>Send a Message</h1>
        <p className='mb-4'>Send a message that will be displayed on the Pi-powered display.</p>
        <Form.Field>
            <Form.Label>Message</Form.Label>
            <Form.Control>
                <Form.Input
                    color={isValid ? (isSubmitError ? 'danger' : 'success') : 'text'}
                    value={message}
                    onChange={handleChange}
                />
                <Icon align='left' size='small' className='has-text-grey'>
                    <i className='far fa-comment' />
                </Icon>
            </Form.Control>
            <div className='has-text-right'>{MAX_CHARS - message.length}</div>
        </Form.Field>
        <Form.Field kind='group'>
            <Form.Control className='is-flex'>
                <Button disabled={!isValid || props.isProcessing} color='primary' onClick={handleSubmit}>Submit</Button>
                {<span className={`is-justify-content-center is-flex is-flex-direction-column ml-2 ${isSubmitError ? 'has-text-danger' : ''}`}>{formResponse}</span>}
                {props.isProcessing && <span className={'is-justify-content-center is-flex is-flex-direction-column ml-2 has-text-warning'}>Please wait. Display is processing.</span>}
            </Form.Control>
        </Form.Field>
    </section>);
};
