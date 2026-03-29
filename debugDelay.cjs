const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');
content = content.replace(
  'toast("Merging " + events.length + " events");\n            mergeAppleEvents(events);',
  'toast("Merging " + events.length + " events");\n            mergeAppleEvents(events);\n            setTimeout(() => toast("After 2s: check calendar"), 2000);'
);
fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
