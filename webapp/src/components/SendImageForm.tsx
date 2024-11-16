/* eslint-disable jsdoc/require-jsdoc */
import React, { useState } from 'react';
import { Button, Form } from 'react-bulma-components';
import DisplayTimeOptions, { TimeOption } from './DisplayTimeOptions';
import Headline from './Headline';
import { ProcessingProps } from './shared.types';

/** The time options for the form */
const ALLOWED_TIMES: readonly TimeOption[] = [
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

/** The endpoint path to submit an image to the pi */
const ENDPOINT: string = '/api/send-image';

/**
 * A component for allowing a user to send an image to the display
 * @returns The send image form component
 */
export default function SendImageForm({ isProcessing, setIsProcessing }: ProcessingProps): JSX.Element {
  const [image, setImage] = useState<File | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [formResponse, setFormResponse] = useState('');
  const [minToDisplay, setMinToDisplay] = useState('5');

  /**
   * Event handler for a file being uploaded in the client
   * @param e The change event
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // eslint-disable-next-line @typescript-eslint/typedef
    const { files } = e.target;
    if (files && files.length) {
      setImage(files[0]);
      setIsValid(true);
    } else {
      setImage(null);
      setIsValid(false);
    }
  };

  /**
   * An event handler for the form submission
   */
  const handleSubmit = (): void => {
    if (image != null) {
      setIsProcessing(true);
      const payload: FormData = new FormData();
      payload.append('file', image);
      payload.append('minToDisplay', minToDisplay);

      fetch(ENDPOINT, {
        method: 'POST',
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: payload
      })
        .then((data: Response) => data.json())
        .then((json: { message: string }) => {
          setFormResponse(json.message);
          setIsProcessing(false);
        })
        .catch((err: Error) => {
          setIsSubmitError(true);
          console.error(err);
          setIsProcessing(false);
        });
    }
  };

  return (
    <section className="mb-6">
      <Headline title="Send an Image" icon="fas fa-image" />
      <Form.Field className="mb-5">
        <Form.Control>
          <Form.InputFile
            inputProps={
              {
                accept: '.png, .jpg, .jpeg',
                type: 'file'
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } as any
            }
            filename={image ? image.name : ''}
            icon={<i className="fas fa-upload" />}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e)}
          />
        </Form.Control>
      </Form.Field>
      <DisplayTimeOptions id="send-image" value={minToDisplay} handleChange={setMinToDisplay} times={ALLOWED_TIMES} />
      <Form.Field kind="group">
        <Form.Control className="is-flex">
          <Button disabled={!isValid || isProcessing} color="primary" onClick={() => handleSubmit()}>
            Send Image
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
