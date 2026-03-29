const fs = require('fs');

const file = 'src/components/CalendarPage.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove the remaining "All" button block that still references selectedAppleCalendars
content = content.replace(
/\s*<button\s*\n\s*onClick=\{\(\) => setSelectedAppleCalendars\(\[\]\)\}[\s\S]*?<\/button>/g,
''
);

// Remove any remaining appleCalendarList map block
content = content.replace(
/\s*\{appleCalendarList\.map\(\(cal\) => \([\s\S]*?\)\)\}/g,
''
);

// Remove any leftover selectedAppleCalendars expressions
content = content.replace(/selectedAppleCalendars\.length === 0/g, 'true');
content = content.replace(/selectedAppleCalendars\.includes\(cal\)/g, 'false');
content = content.replace(/setSelectedAppleCalendars\(\(prev\) =>[\s\S]*?\)\);/g, '');

fs.writeFileSync(file, content);
console.log('Remaining Apple filter references cleaned');
