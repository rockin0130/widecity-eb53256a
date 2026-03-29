const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');

// Add useAppContext import
content = content.replace(
  'import { useAuth } from "@/context/AuthContext";',
  'import { useAuth } from "@/context/AuthContext";\nimport { useAppContext } from "@/context/AppContext";'
);

// Add setAppleCalendarEvents to component
content = content.replace(
  'const { user, session, profile, partner, groups, activeGroup, setActiveGroup, signOut, connectPartner, disconnectPartner } = useAuth();',
  'const { user, session, profile, partner, groups, activeGroup, setActiveGroup, signOut, connectPartner, disconnectPartner } = useAuth();\n  const { setAppleCalendarEvents } = useAppContext();'
);

fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
