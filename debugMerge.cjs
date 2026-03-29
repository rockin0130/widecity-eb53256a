const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');
content = content.replace(
  '          if (events && events.length > 0) {\n            mergeAppleEvents(events);\n          }',
  '          if (events && events.length > 0) {\n            toast("Merging " + events.length + " events");\n            mergeAppleEvents(events);\n          } else {\n            toast("No events found: " + JSON.stringify(events?.length));\n          }'
);
fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
