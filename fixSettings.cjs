const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');

// Remove mergeAppleEvents calls
content = content.replace(
  /\s*mergeAppleEvents\(events\);/g,
  ''
);

// Remove unused import if exists
content = content.replace(
  "import { requestCalendarPermission, getCalendarEvents } from \"../integrations/appleCalendar\";",
  "import { requestCalendarPermission } from \"../integrations/appleCalendar\";"
);

fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
