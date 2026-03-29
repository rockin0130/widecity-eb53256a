const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');

// Uncomment appleCalendarEvents
content = content.replace(
  '    // appleCalendarEvents, setAppleCalendarEvents,',
  '    appleCalendarEvents, setAppleCalendarEvents,'
);

// Safe array check instead of try-catch
content = content.replace(
  '    try { appleCalendarEvents.forEach((ae) => {',
  '    if (Array.isArray(appleCalendarEvents)) { appleCalendarEvents.forEach((ae) => {'
);

content = content.replace(
  '    } catch(e) { console.error("Apple calendar error:", e); }',
  '    }'
);

fs.writeFileSync('src/components/CalendarPage.tsx', content);
console.log('Done!');
