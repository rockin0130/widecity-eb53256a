const fs = require('fs');

const file = 'src/components/CalendarPage.tsx';
let content = fs.readFileSync(file, 'utf8');

// remove state
content = content.replace(
/const \[selectedAppleCalendars[\s\S]*?useState<.*?>\(\[\]\);/g,
''
);

// remove list
content = content.replace(
/const appleCalendarList[\s\S]*?useMemo\([\s\S]*?\);/g,
''
);

// remove UI block
content = content.replace(
/\{appleCalendarList\.map[\s\S]*?\}\)\}/g,
''
);

fs.writeFileSync(file, content);
console.log('Old Apple filter removed');
