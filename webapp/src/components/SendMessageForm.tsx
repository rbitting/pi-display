import React, { useState } from 'react';
import { Form, Icon, Button } from 'react-bulma-components';
import { ProcessingProps } from '../prop-types';
import DisplayTimeOptions from './DisplayTimeOptions';
import Headline from './Headline';

const MIN_CHARS = 1;
const MAX_CHARS = 100;
const ENDPOINT = '/api/sendmessage';
const ALLOWED_TIMES = [
    {
        value: '1',
        label: '1 Min'
    },
    {
        value: '30',
        label: '30 Min'
    },
    {
        value: '60',
        label: '1 Hr'
    },
    {
        value: '0',
        label: '∞'
    }
];

export default function SendMessageForm({ isProcessing, setIsProcessing }: ProcessingProps) {
    const [message, setMessage] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isSubmitError, setIsSubmitError] = useState(false);
    const [formResponse, setFormResponse] = useState('');
    const [minToDisplay, setMinToDisplay] = useState('1');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e && e.target) {
            const val = e.target.value;
            const len = val.length;
            if (len > MAX_CHARS) {
                return false;
            }
            setMessage(val);
            setIsValid(len >= MIN_CHARS && len <= MAX_CHARS);
            setFormResponse('');
            setIsSubmitError(false);
            return true;
        }
        return false;
    };

    const handleSubmit = async () => {
        setIsProcessing(true);
        if (isValid) {
            const payload = {
                message,
                minToDisplay
            };
            const response = await fetch(ENDPOINT, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(payload)
            }).catch((err) => {
                console.error(err);
                setIsSubmitError(true);
                setFormResponse(`Could not fetch ${ENDPOINT}. ${err}`);
            });

            if (response) {
                const { status } = response;
                if (status === 200) {
                    const json = await response.json();
                    setFormResponse(`Message sent: '${json.data}'`);
                    setMessage('');
                    setIsValid(false);
                    setIsSubmitError(false);
                } else {
                    setIsSubmitError(true);
                    if (status === 404) {
                        setFormResponse(
                            `404 '${ENDPOINT}' endpoint not found. Please check that the server is running.'`
                        );
                    } else {
                        try {
                            const json = await response.json();
                            setFormResponse(json.message);
                        } catch (e) {
                            console.error(e);
                            setFormResponse(`${status} ${response.statusText}`);
                        }
                    }
                }
            } else {
                console.error('Invalid response', response);
            }
            setIsProcessing(false);
        }
    };

    let color = 'success';
    if (!isValid) {
        color = 'text';
    } else if (isSubmitError) {
        color = 'danger';
    }

    return (
        <section className="mb-6">
            <Headline title="Send a Message" icon="fas fa-comment-alt" />
            <Form.Field className="mb-0">
                <Form.Control>
                    <Form.Input
                        color={color}
                        onChange={handleChange}
                        placeholder="Type a message to show on display"
                        value={message}
                    />
                    <Icon align="left" size="small" className="has-text-grey">
                        <i className="far fa-comment" />
                    </Icon>
                </Form.Control>
                <div className="has-text-right">{MAX_CHARS - message.length}</div>
            </Form.Field>
            <DisplayTimeOptions
                id="send-message"
                value={minToDisplay}
                handleChange={setMinToDisplay}
                times={ALLOWED_TIMES}
            />
            <Form.Field kind="group">
                <Form.Control className="is-flex">
                    <Button disabled={!isValid || isProcessing} color="primary" onClick={handleSubmit}>
                        Send Message
                    </Button>
                    {!isProcessing && (
                        <span
                            className={`is-justify-content-center is-flex is-flex-direction-column ml-2 ${
                                isSubmitError ? 'has-text-danger' : ''
                            }`}
                        >
                            {formResponse}
                        </span>
                    )}
                    {isProcessing && (
                        <span className="is-justify-content-center is-flex is-flex-direction-column ml-2 has-text-warning">
                            Please wait. Display is processing.
                        </span>
                    )}
                </Form.Control>
            </Form.Field>
        </section>
    );
}
