const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');

content = content.replace(
  '    appleCalendarEvents.forEach((ae) => {',
  '    try { appleCalendarEvents.forEach((ae) => {'
);

content = content.replace(
  '    if (showGoogleCalendar) {\n      googleCalendarEvents.forEach((ge) => {',
  '    } catch(e) { console.error("Apple calendar error:", e); }\n\n    if (showGoogleCalendar) {\n      googleCalendarEvents.forEach((ge) => {'
);

fs.writeFileSync('src/components/CalendarPage.tsx', content);
console.log('Done!');
