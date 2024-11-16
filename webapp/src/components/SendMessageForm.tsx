import React, { useState } from 'react';
import { Button, Form, Icon } from 'react-bulma-components';
import DisplayTimeOptions, { TimeOption } from './DisplayTimeOptions';
import Headline from './Headline';
import { ProcessingProps } from './shared.types';

/** The time options for the form */
const ALLOWED_TIMES: readonly TimeOption[] = [
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

/** The endpoint path to submit a message to the pi */
const ENDPOINT: string = '/api/sendmessage';

/** Maximum characters allowed in the message */
const MAX_CHARS: number = 100;

/** Minimum characters allowed in the message */
const MIN_CHARS: number = 1;

/**
 * Represents a request to the send message endpoint
 */
interface MessageRequest {
  /** The message to display */
  readonly message: string;
  /** The amount of time in minutes to display the message */
  readonly minToDisplay: string;
}

/**
 * A component for sending a message to show on the display
 * @returns The send message form component
 */
export default function SendMessageForm({ isProcessing, setIsProcessing }: ProcessingProps): JSX.Element {
  const [message, setMessage] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [formResponse, setFormResponse] = useState('');
  const [minToDisplay, setMinToDisplay] = useState('1');

  /**
   * An event handler for changes to the input element
   * @param e The input change event
   * @returns Whether the submission succeeded or not
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): boolean => {
    if (e && e.target) {
      const val: string = e.target.value;
      const len: number = val.length;
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

  /**
   * Submits the message to the display
   */
  const handleSubmit = async (): Promise<void> => {
    setIsProcessing(true);
    if (isValid) {
      const payload: MessageRequest = {
        message,
        minToDisplay
      };
      const response: Response | null = await fetch(ENDPOINT, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(payload)
      }).catch((err: Error) => {
        console.error(err);
        setIsSubmitError(true);
        setFormResponse(`Could not fetch ${ENDPOINT}. ${err}`);
        return null;
      });

      if (response) {
        const { status } = response;
        if (status === 200) {
          // eslint-disable-next-line @typescript-eslint/typedef
          const json = await response.json();
          setFormResponse(`Message sent: '${json.data}'`);
          setMessage('');
          setIsValid(false);
          setIsSubmitError(false);
        } else {
          setIsSubmitError(true);
          if (status === 404) {
            setFormResponse(`404 '${ENDPOINT}' endpoint not found. Please check that the server is running.'`);
          } else {
            try {
              // eslint-disable-next-line @typescript-eslint/typedef
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

  let color: string = 'success';
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
      <DisplayTimeOptions id="send-message" value={minToDisplay} handleChange={setMinToDisplay} times={ALLOWED_TIMES} />
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
