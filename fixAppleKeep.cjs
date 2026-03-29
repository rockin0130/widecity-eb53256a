const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Keep a ref of apple events that never gets cleared
content = content.replace(
  '  const [appleCalendarEvents, setAppleCalendarEvents] = useState<AppleCalendarEvent[]>([]);',
  `  const [appleCalendarEvents, setAppleCalendarEvents] = useState<AppleCalendarEvent[]>([]);
  const appleEventsRef = useRef<GoogleCalendarEvent[]>([]);`
);

// When mergeAppleEvents is called, save to ref
content = content.replace(
  `      mergeAppleEvents: (events: AppleCalendarEvent[]) => {
        const converted = events.map((ae) => ({`,
  `      mergeAppleEvents: (events: AppleCalendarEvent[]) => {
        const converted = events.map((ae) => ({`
);

// Save to ref when setting google calendar events in mergeAppleEvents
content = content.replace(
  `        setGoogleCalendarEvents((prev) => {
          const withoutApple = prev.filter((e) => !e.id.startsWith("apple-"));
          return [...withoutApple, ...converted];
        });
      },`,
  `        const appleConverted = converted.map((e) => ({ ...e, id: e.id.startsWith("apple-") ? e.id : "apple-" + e.id }));
        appleEventsRef.current = appleConverted;
        setGoogleCalendarEvents((prev) => {
          const withoutApple = prev.filter((e) => !e.id.startsWith("apple-"));
          return [...withoutApple, ...appleConverted];
        });
      },`
);

// In Google Calendar useEffect, always restore apple events from ref
content = content.replace(
  '        if (cancelled) return;\n        setGoogleCalendarEvents((prev) => {\n          const appleEvents = prev.filter((e) => e.id.startsWith("apple-"));\n          const newMap = new Map();\n\n          [...enriched, ...appleEvents].forEach(e => {\n            newMap.set(e.id, e);\n          });\n\n          return Array.from(newMap.values());\n        });',
  `        if (cancelled) return;
        setGoogleCalendarEvents(() => {
          const newMap = new Map();
          [...enriched, ...appleEventsRef.current].forEach(e => {
            newMap.set(e.id, e);
          });
          return Array.from(newMap.values());
        });`
);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log('Done!');
