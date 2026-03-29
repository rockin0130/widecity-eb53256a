const fs = require('fs');

const path = 'src/context/AppContext.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
`        setGoogleCalendarEvents((prev) => {
          const appleEvents = prev.filter((e) => e.id.startsWith("apple-"));
          return [...enriched, ...appleEvents];
        });`,
`        setGoogleCalendarEvents((prev) => {
          const appleEvents = prev.filter((e) => e.id.startsWith("apple-"));
          const newMap = new Map();

          [...enriched, ...appleEvents].forEach(e => {
            newMap.set(e.id, e);
          });

          return Array.from(newMap.values());
        });`
);

fs.writeFileSync(path, content);
console.log("Apple persist fix applied");
