const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');
content = content.replace(
  'const handleConnectAppleCalendar = async () => {\n    setAppleCalLoading(true);\n    try {',
  'const handleConnectAppleCalendar = async () => {\n    setAppleCalLoading(true);\n    toast("버튼 눌림!");\n    try {'
);
fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
