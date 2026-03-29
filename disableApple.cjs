const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');

// Disable appleCalendarEvents destructuring temporarily
content = content.replace(
  '    appleCalendarEvents, setAppleCalendarEvents,',
  '    // appleCalendarEvents, setAppleCalendarEvents,'
);

fs.writeFileSync('src/components/CalendarPage.tsx', content);
console.log('Done!');
