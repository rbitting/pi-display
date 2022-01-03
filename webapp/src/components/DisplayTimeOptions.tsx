import React from 'react';
import { Form } from 'react-bulma-components';

export interface TimeProps {
    readonly label: string;
    readonly value: string;
}

interface DisplayTimeOptionsProps {
    readonly times: Array<TimeProps>;
    readonly handleChange: (value: string) => void;
    readonly value: string;
    readonly id: string;
}

export default function DisplayTimeOptions({ times, handleChange, id, value }: DisplayTimeOptionsProps) {
    return (
        <Form.Field className="mb-5 is-horizontal">
            <Form.Label className="mr-3">Display for:</Form.Label>
            <Form.Control>
                {times.map((time) => {
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
