const fs = require('fs');

const file = 'src/components/CalendarPage.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove any leftover broken appleCalendarList/useMemo block
content = content.replace(
/\s*const appleCalendarList = useMemo\(\(\) => \{[\s\S]*?\}, \[googleCalendarEvents\]\);\n/g,
'\n'
);

// Also remove any dangling fragment that ends with return Array.from(set);
content = content.replace(
/\s*const set = new Set<string>\(\);[\s\S]*?return Array\.from\(set\);\s*\}, \[googleCalendarEvents\]\);\n/g,
'\n'
);

fs.writeFileSync(file, content);
console.log('Broken apple useMemo block removed');
