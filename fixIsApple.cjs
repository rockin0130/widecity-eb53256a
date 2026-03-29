const fs = require('fs');

// 1. Add isApple to GoogleCalendarEvent interface
let appContent = fs.readFileSync('src/context/AppContext.tsx', 'utf8');
appContent = appContent.replace(
  '  calendarColor?: string | null;\n}',
  '  calendarColor?: string | null;\n  isApple?: boolean;\n}'
);

// 2. Set isApple: true when merging Apple events
appContent = appContent.replace(
  'setAppleCalendarEvents(events);\n        const converted = events.map((ae) => ({',
  'setAppleCalendarEvents(events);\n        const converted = events.map((ae) => ({\n          isApple: true,'
);

fs.writeFileSync('src/context/AppContext.tsx', appContent);

// 3. Use isApple flag in CalendarPage badge
let calContent = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');
calContent = calContent.replace(
  /\{item\.type === "gcal" && <GoogleBadge \/>\}/g,
  '{item.type === "gcal" && ((item.raw as any)?.isApple ? <AppleBadge /> : <GoogleBadge />)}'
);
fs.writeFileSync('src/components/CalendarPage.tsx', calContent);

console.log('Done!');
