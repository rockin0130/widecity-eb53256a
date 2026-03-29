const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');

// Remove source: "apple" field that's causing the crash
content = content.replace(
  '          source: "apple" as const,\n          raw: ae,',
  '          raw: ae,'
);

fs.writeFileSync('src/components/CalendarPage.tsx', content);
console.log('Done!');
