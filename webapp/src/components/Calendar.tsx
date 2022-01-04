import React from 'react';
import Headline from './Headline';
import { GOOGLE_CALENDAR_URL } from '../config';

export default function Calendar() {
    let isValid = true;
    if (!GOOGLE_CALENDAR_URL?.startsWith('https://calendar.google.com/calendar/embed?')) {
        console.error(`GOOGLE_CALENDAR_URL in .env is invalid: ${GOOGLE_CALENDAR_URL}`);
        isValid = false;
    }
    return (
        <div>
            <Headline title="Calendar" icon="fas fa-calendar-alt" />
            {isValid && (
                <iframe
                    title="Google Calendar"
                    src={GOOGLE_CALENDAR_URL}
                    style={{ borderWidth: 0 }}
                    width="800"
                    height="600"
                    frameBorder="0"
                    scrolling="no"
                />
            )}
            {!isValid && <div>Invalid calendar url.</div>}
        </div>
    );
}
