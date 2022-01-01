import React from 'react';
import Headline from './Headline';

export default function Calendar() {
    return <div>
        <Headline title="Calendar" icon="fas fa-calendar-alt"/>
        <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=America%2FNew_York&showTabs=0&showPrint=0&showCalendars=0&showDate=1&src=YzFqdXBxcWhqb2dxZnVqbXZidW83a3YybnNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23F4511E" style={{ borderWidth: 0 }} width="800" height="600" frameBorder="0" scrolling="no"></iframe>
    </div>;
}
