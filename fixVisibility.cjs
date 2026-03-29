const fs = require('fs');

const path = 'src/components/CalendarPage.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
`        // Calendar visibility filter for Google Calendar events
        if (hasCalendarData && ge.calendarId && !visibleProviderCalendarIds.has(ge.calendarId)) return;`,
`        // Calendar visibility filter for external calendar events
        // Do not hide events during initial sync before visible calendar ids are fully loaded
        if (
          hasCalendarData &&
          ge.calendarId &&
          visibleProviderCalendarIds.size > 0 &&
          !visibleProviderCalendarIds.has(ge.calendarId)
        ) return;`
);

fs.writeFileSync(path, content);
console.log("Fix applied");
