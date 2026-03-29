const fs = require('fs');
let cal = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');

// Remove apple direct rendering block
const start = cal.indexOf('      // Render Apple Calendar events directly from appleCalendarEvents state');
const end = cal.indexOf('      items.sort((a, b) => {');
if (start !== -1 && end !== -1) {
  cal = cal.slice(0, start) + '      ' + cal.slice(end);
}

// Remove appleCalendarEvents from destructuring
cal = cal.replace(
  '    appleCalendarEvents,\n',
  ''
);

// Remove from dependency array
cal = cal.replace(
  '  }, [filteredEvents, filteredTasks, googleCalendarEvents, showGoogleCalendar, appleCalendarEvents]);',
  '  }, [filteredEvents, filteredTasks, googleCalendarEvents, showGoogleCalendar]);'
);

fs.writeFileSync('src/components/CalendarPage.tsx', cal);
console.log('Done!');
