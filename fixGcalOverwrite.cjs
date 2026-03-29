const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// When resetting, keep Apple events
content = content.replace(
  '      setGoogleCalendarEvents([]);',
  '      setGoogleCalendarEvents((prev) => prev.filter((e) => e.id.startsWith("apple-")));'
);

// When setting enriched, keep Apple events
content = content.replace(
  '        setGoogleCalendarEvents(enriched);',
  '        setGoogleCalendarEvents((prev) => {\n          const appleEvents = prev.filter((e) => e.id.startsWith("apple-"));\n          return [...enriched, ...appleEvents];\n        });'
);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log('Done!');
