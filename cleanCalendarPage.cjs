const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');

// Remove apple from type union
content = content.replace(
  '  type: "event" | "task" | "gcal" | "apple";',
  '  type: "event" | "task" | "gcal";'
);

// Remove AppleCalendarEvent from raw union
content = content.replace(
  '  raw: ScheduledEvent | Task | GoogleCalendarEvent | AppleCalendarEvent;',
  '  raw: ScheduledEvent | Task | GoogleCalendarEvent;'
);

// Remove appleCalendarEvents from destructuring
content = content.replace(
  '    appleCalendarEvents, setAppleCalendarEvents,\n',
  ''
);

// Remove entire Apple block
const start = content.indexOf('        if (Array.isArray(appleCalendarEvents))');
const end = content.indexOf('    if (showGoogleCalendar)');
if (start !== -1 && end !== -1) {
  content = content.slice(0, start) + '    ' + content.slice(end);
}

fs.writeFileSync('src/components/CalendarPage.tsx', content);
console.log('Done!');
