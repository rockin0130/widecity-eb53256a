const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');

// Fix import - remove getCalendarEvents
content = content.replace(
  'import { requestCalendarPermission, getCalendarEvents } from "../integrations/appleCalendar";',
  'import { requestCalendarPermission } from "../integrations/appleCalendar";'
);

// Remove useAppContext line
content = content.replace(
  '\n  const { setAppleCalendarEvents, mergeAppleEvents } = useAppContext();',
  ''
);

// Remove useAppContext import if it exists
content = content.replace(
  '\nimport { useAppContext } from "@/context/AppContext";',
  ''
);

// Fix first occurrence - lines 63-68 area
content = content.replace(
  `        const events = await getCalendarEvents(now, nextYear);
          if (events && events.length > 0) {
            toast("Merging " + events.length + " events");
            mergeAppleEvents(events);
          setTimeout(() => toast("After 2s: check calendar"), 2000);
          }`,
  ''
);

// Fix second occurrence - lines 165-169 area  
content = content.replace(
  `        const events = await getCalendarEvents(now, nextYear);
          if (events && events.length > 0) {
            mergeAppleEvents(events);
          }`,
  ''
);

fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
