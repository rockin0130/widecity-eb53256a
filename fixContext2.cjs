const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');
content = content.replace(
  '  } = useAuth();\n  const [showPartnerDialog',
  '  } = useAuth();\n  const { setAppleCalendarEvents } = useAppContext();\n  const [showPartnerDialog'
);
fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
