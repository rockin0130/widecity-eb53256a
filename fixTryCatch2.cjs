const fs = require('fs');
let cal = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');

cal = cal.replace(
  '      // Render Apple Calendar events\n      appleEvents.forEach((ae) => {',
  '      // Render Apple Calendar events\n      try { appleEvents.forEach((ae) => {'
);

cal = cal.replace(
  '      items.sort((a, b) => {',
  '      } catch(e) {} \n\n      items.sort((a, b) => {'
);

fs.writeFileSync('src/components/CalendarPage.tsx', cal);
console.log('Done!');
