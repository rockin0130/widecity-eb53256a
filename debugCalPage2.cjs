const fs = require('fs');
let cal = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');
cal = cal.replace(
  '    if (appleLoadedRef.current) return;\n    requestCalendarPermission()',
  '    requestCalendarPermission()'
);
fs.writeFileSync('src/components/CalendarPage.tsx', cal);
console.log('Done!');
