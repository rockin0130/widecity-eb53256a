const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');
content = content.replace(
  "toast.error('Failed to connect Apple Calendar');",
  "toast.error('Error: ' + (err instanceof Error ? err.message : JSON.stringify(err)));"
);
fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
