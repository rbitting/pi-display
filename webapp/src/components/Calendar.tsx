import React from 'react';
import { GOOGLE_CALENDAR_URL } from '../config';
import Headline from './Headline';

/**
 * A component for displaying the user's Google calendar
 * @returns The calendar component
 */
export default function Calendar(): JSX.Element {
  let isValid: boolean = true;
  if (!GOOGLE_CALENDAR_URL?.startsWith('https://calendar.google.com/calendar/embed?')) {
    console.error(`GOOGLE_CALENDAR_URL in .env is invalid: ${GOOGLE_CALENDAR_URL}`);
    isValid = false;
  }
  return (
    <>
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
    </>
  );
}
