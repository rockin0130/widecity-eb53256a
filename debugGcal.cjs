const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Add debug log to track when apple events disappear
content = content.replace(
  'setGoogleCalendarEvents((prev) => {\n          const appleEvents = prev.filter((e) => e.id.startsWith("apple-"));\n          return [...enriched, ...appleEvents];\n        });',
  'setGoogleCalendarEvents((prev) => {\n          const appleEvents = prev.filter((e) => e.id.startsWith("apple-"));\n          console.log("GCAL LOAD: enriched=" + enriched.length + " apple=" + appleEvents.length);\n          return [...enriched, ...appleEvents];\n        });'
);

content = content.replace(
  'setGoogleCalendarEvents((prev) => prev.filter((e) => e.id.startsWith("apple-")));',
  'console.log("GCAL RESET: keeping apple only");\n      setGoogleCalendarEvents((prev) => prev.filter((e) => e.id.startsWith("apple-")));'
);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log('Done!');
