import React from 'react';
import { Form } from 'react-bulma-components';

/**
 * Represents a time option
 */
export interface TimeOption {
  /** The label to display to the user for the time @example "3 Min" */
  readonly label: string;
  /** The underlying value of the time @example "5" */
  readonly value: string;
}

/**
 * Allowed propertise for the {@link DisplayTimeOptions} component
 */
interface DisplayTimeOptionsProps {
  /** An event handler for time option value changes */
  readonly handleChange: (value: string) => void;
  /** A unique id to use for the key of the options displayed */
  readonly id: string;
  /** The times to display */
  readonly times: readonly TimeOption[];
  /** The current time value */
  readonly value: string;
}

/**
 * A component for displaying time options
 * @returns The time options component
 */
export default function DisplayTimeOptions({ handleChange, id, times, value }: DisplayTimeOptionsProps): JSX.Element {
  return (
    <Form.Field className="mb-5 is-horizontal">
      <Form.Label className="mr-3">Display for:</Form.Label>
      <Form.Control>
        {times.map((time: TimeOption) => {
          return (
            <Form.Radio
              checked={value === time.value}
              className="mr-3"
              key={id + time.value}
              name={`time-to-display${id}`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
              value={time.value}
            >
              {time.label}
            </Form.Radio>
          );
        })}
      </Form.Control>
    </Form.Field>
  );
}
