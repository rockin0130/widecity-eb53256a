const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

content = content.replace(
  'setGoogleCalendarEvents((prev) => {\n          const appleEvents = prev.filter((e) => e.id.startsWith("apple-"));\n          console.log("GCAL LOAD: enriched=" + enriched.length + " apple=" + appleEvents.length);\n          return [...enriched, ...appleEvents];\n        });',
  'setGoogleCalendarEvents((prev) => {\n          const appleEvents = prev.filter((e) => e.id.startsWith("apple-"));\n          return [...enriched, ...appleEvents];\n        });'
);

content = content.replace(
  'console.log("GCAL RESET: keeping apple only");\n      setGoogleCalendarEvents((prev) => prev.filter((e) => e.id.startsWith("apple-")));',
  'setGoogleCalendarEvents((prev) => prev.filter((e) => e.id.startsWith("apple-")));'
);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log('Done!');
