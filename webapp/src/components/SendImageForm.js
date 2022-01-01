import React, { useState } from 'react';
import { Button, Form } from 'react-bulma-components';
import Headline from './Headline';
import DisplayTimeOptions from './DisplayTimeOptions';

const ENDPOINT = '/send-image';
// eslint-disable-next-line no-unused-vars
const ALLOWED_TIMES = [
    {
        value: '5',
        label: '5 Min'
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

export default function SendImageForm(props) {
    const [image, setImage] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isSubmitError, setIsSubmitError] = useState(false);
    const [formResponse, setFormResponse] = useState('');
    const [minToDisplay, setMinToDisplay] = useState('5');

    function handleFileChange(e) {
        const files = e.target.files;
        if (files.length) {
            setImage(files[0]);
            setIsValid(true);
        } else {
            setImage(null);
            setIsValid(false);
        }
    }

    function handleSubmit() {
        props.setIsProcessing(true);
        const payload = new FormData();
        payload.append('file', image);
        payload.append('minToDisplay', minToDisplay);

        fetch(ENDPOINT, {
            method: 'POST',
            credentials: 'same-origin',
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: payload
        })
            .then(data => data.json())
            .then(json => {
                setFormResponse(json.message);
                props.setIsProcessing(false);
            })
            .catch(err => {
                setIsSubmitError(true);
                console.error(err);
                props.setIsProcessing(false);
            });
    }

    return (<section className='mb-6'>
        <Headline title='Send an Image' icon='fas fa-image' />
        <Form.Field className='mb-5'>
            <Form.Control>
                <Form.InputFile
                    accept='.png, .jpg, .jpeg'
                    filename={image.name}
                    icon={<i className="fas fa-upload"></i>}
                    onChange={handleFileChange}
                    type='file'
                />
            </Form.Control>
        </Form.Field>
        <DisplayTimeOptions
            id="send-image"
            value={minToDisplay}
            handleChange={setMinToDisplay}
            times={ALLOWED_TIMES} />
        <Form.Field kind='group'>
            <Form.Control className='is-flex'>
                <Button disabled={!isValid || props.isProcessing} color='primary' onClick={handleSubmit}>Send Image</Button>
                {!props.isProcessing && <span className={`is-justify-content-center is-flex is-flex-direction-column ml-2 ${isSubmitError ? 'has-text-danger' : ''}`}>{formResponse}</span>}
                {props.isProcessing && <span className={'is-justify-content-center is-flex is-flex-direction-column ml-2 has-text-warning'}>Please wait. Display is processing.</span>}
            </Form.Control>
        </Form.Field>
    </section>);
};
