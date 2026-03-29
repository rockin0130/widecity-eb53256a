const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Remove setAppleCalendarEvents from mergeAppleEvents to avoid double execution
content = content.replace(
  `      mergeAppleEvents: (events: AppleCalendarEvent[]) => {
        setAppleCalendarEvents(events);
        const converted = events.map((ae) => ({`,
  `      mergeAppleEvents: (events: AppleCalendarEvent[]) => {
        const converted = events.map((ae) => ({`
);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log('Done!');
