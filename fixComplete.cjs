const fs = require('fs');

// 1. Fix AppContext - simple useEffect approach
let appContent = fs.readFileSync('src/context/AppContext.tsx', 'utf8');
appContent = appContent.replace(
  '  const [appleCalendarEvents, setAppleCalendarEvents] = useState<AppleCalendarEvent[]>([]);',
  `  const [appleCalendarEvents, setAppleCalendarEvents] = useState<AppleCalendarEvent[]>([]);

  useEffect(() => {
    if (appleCalendarEvents.length === 0) return;
    const converted = appleCalendarEvents.map((ae) => ({
      id: ae.id,
      title: ae.title,
      description: null,
      start: new Date(ae.startDate).toISOString(),
      end: new Date(ae.endDate).toISOString(),
      allDay: ae.allDay,
      location: ae.location || null,
      htmlLink: "",
      calendarColor: ae.calendarColor || "#888888",
      assignee: "me" as const,
      done: false,
      completedAt: null,
      completedBy: null,
    }));
    setGoogleCalendarEvents((prev) => {
      const withoutApple = prev.filter((e) => !e.id.startsWith("apple-"));
      const appleConverted = converted.map((e) => ({ ...e, id: "apple-" + e.id }));
      return [...withoutApple, ...appleConverted];
    });
  }, [appleCalendarEvents]);`
);

// Preserve apple events when Google Calendar reloads
appContent = appContent.replace(
  '        setGoogleCalendarEvents(enriched);',
  `        setGoogleCalendarEvents((prev) => {
          const appleEvents = prev.filter((e) => e.id.startsWith("apple-"));
          return [...enriched, ...appleEvents];
        });`
);
appContent = appContent.replace(
  '      setGoogleCalendarEvents([]);',
  `      setGoogleCalendarEvents((prev) => prev.filter((e) => e.id.startsWith("apple-")));`
);
fs.writeFileSync('src/context/AppContext.tsx', appContent);

// 2. Fix SettingsPage - properly use setAppleCalendarEvents
let settings = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');

// Make sure useAppContext is called
if (!settings.includes('const { setAppleCalendarEvents }')) {
  settings = settings.replace(
    'const { user, session, profile, partner, groups, activeGroup, setActiveGroup, signOut, connectPartner, disconnectPartner } = useAuth();',
    'const { user, session, profile, partner, groups, activeGroup, setActiveGroup, signOut, connectPartner, disconnectPartner } = useAuth();\n  const { setAppleCalendarEvents } = useAppContext();'
  );
}

// Replace setAppleCalendarEvents call (keep it simple)
settings = settings.replace(
  /setAppleCalendarEvents\(events\);/g,
  'setAppleCalendarEvents(events);'
);

fs.writeFileSync('src/components/SettingsPage.tsx', settings);

console.log('Done!');
