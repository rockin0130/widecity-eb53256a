const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');

// Fix import
content = content.replace(
  'import { requestCalendarPermission } from "../integrations/appleCalendar";',
  'import { requestCalendarPermission, getCalendarEvents } from "../integrations/appleCalendar";'
);

// Add setAppleCalendarEvents from useAppContext
content = content.replace(
  'const { setAppleCalendarEvents, mergeAppleEvents } = useAppContext();',
  'const { setAppleCalendarEvents } = useAppContext();'
);

// Replace mergeAppleEvents with setAppleCalendarEvents
content = content.replace(
  'mergeAppleEvents(events);',
  'setAppleCalendarEvents(events);'
);

fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
