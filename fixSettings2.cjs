const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');

content = content.replace(
  'import { requestCalendarPermission, getCalendarEvents } from "../integrations/appleCalendar";',
  'import { requestCalendarPermission } from "../integrations/appleCalendar";'
);

content = content.replace(
  'import { requestCalendarPermission } from "../integrations/appleCalendar";',
  'import { requestCalendarPermission } from "../integrations/appleCalendar";'
);

// Remove any getCalendarEvents usage
content = content.replace(/const events = await getCalendarEvents\(now, nextYear\);\s*/g, '');
content = content.replace(/if \(events && events\.length > 0\) \{[\s\S]*?\}/g, '');

fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
