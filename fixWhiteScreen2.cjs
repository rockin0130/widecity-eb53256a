const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');

// Remove entire Apple Calendar block
const start = content.indexOf('if (appleCalendarEvents.length > 0) {');
const end = content.indexOf('    if (showGoogleCalendar) {');
if (start !== -1 && end !== -1) {
  content = content.slice(0, start) + content.slice(end);
}

fs.writeFileSync('src/components/CalendarPage.tsx', content);
console.log('Done!');
