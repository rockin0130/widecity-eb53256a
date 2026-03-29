const fs = require('fs');

const file = 'src/components/CalendarPage.tsx';
let content = fs.readFileSync(file, 'utf8');

const badBlock = `
  
    googleCalendarEvents.forEach((e: any) => {
      if (e.isApple) {
        set.add(e.calendarTitle || e.calendarId || "Apple");
      }
    });
    return Array.from(set);
  }, [googleCalendarEvents]);
`;

if (!content.includes(badBlock)) {
  console.log('Dangling Apple block not found exactly, trying relaxed cleanup...');
  content = content.replace(
    /\n\s*googleCalendarEvents\.forEach\(\(e: any\) => \{\n\s*if \(e\.isApple\) \{\n\s*set\.add\(e\.calendarTitle \|\| e\.calendarId \|\| "Apple"\);\n\s*\}\n\s*\}\);\n\s*return Array\.from\(set\);\n\s*\}, \[googleCalendarEvents\]\);\n/,
    '\n'
  );
} else {
  content = content.replace(badBlock, '\n');
}

fs.writeFileSync(file, content);
console.log('Dangling Apple block removed');
