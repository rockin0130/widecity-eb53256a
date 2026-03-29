const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');

// Add getCalendarEvents import
content = content.replace(
  'import { requestCalendarPermission } from "../integrations/appleCalendar";',
  'import { requestCalendarPermission, getCalendarEvents } from "../integrations/appleCalendar";'
);

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

// Update handleConnectAppleCalendar to fetch events after permission granted
content = content.replace(
  `      const result = await requestCalendarPermission();
      if (result.result === 'granted') {
        setAppleCalConnected(true);
        toast.success("Apple Calendar connected!");
        return;
      }
      if (result.readCalendar === 'granted' || result.writeCalendar === 'granted') {
        setAppleCalConnected(true);
        toast.success('Apple Calendar connected!');
      } else {
        toast.error('Calendar permission denied');
      }`,
  `      const result = await requestCalendarPermission();
      if (result.result === 'granted') {
        setAppleCalConnected(true);
        toast.success("Apple Calendar connected!");
        // Fetch events for the next year
        const now = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        const events = await getCalendarEvents(now, nextYear);
        if (events) setAppleCalendarEvents(events);
        return;
      }
      toast.error('Calendar permission denied');`
);

fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
