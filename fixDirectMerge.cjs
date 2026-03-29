const fs = require('fs');

// 1. Add setGoogleCalendarEvents to AppContext exports
let appContent = fs.readFileSync('src/context/AppContext.tsx', 'utf8');
appContent = appContent.replace(
  '  appleCalendarEvents: AppleCalendarEvent[];\n  setAppleCalendarEvents: (events: AppleCalendarEvent[]) => void;',
  '  appleCalendarEvents: AppleCalendarEvent[];\n  setAppleCalendarEvents: (events: AppleCalendarEvent[]) => void;\n  mergeAppleEvents: (events: AppleCalendarEvent[]) => void;'
);

// Add mergeAppleEvents function before context return
appContent = appContent.replace(
  '      appleCalendarEvents, setAppleCalendarEvents,',
  `      appleCalendarEvents, setAppleCalendarEvents,
      mergeAppleEvents: (events: AppleCalendarEvent[]) => {
        setAppleCalendarEvents(events);
        const converted = events.map((ae) => ({
          id: "apple-" + ae.id,
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
          return [...withoutApple, ...converted];
        });
      },`
);
fs.writeFileSync('src/context/AppContext.tsx', appContent);

// 2. Use mergeAppleEvents in SettingsPage
let settingsContent = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');
settingsContent = settingsContent.replace(
  'const { setAppleCalendarEvents } = useAppContext();',
  'const { setAppleCalendarEvents, mergeAppleEvents } = useAppContext();'
);
settingsContent = settingsContent.replace(
  `        try {
          const events = await getCalendarEvents(now, nextYear);
          toast("Events count: " + (events?.length ?? "null"));
          if (events && events.length > 0) {
            setAppleCalendarEvents(events);
            toast("First id: " + events[0].id);
          }
        } catch(e) {
          toast("getCalendarEvents error: " + e.message);
        }`,
  `        const events = await getCalendarEvents(now, nextYear);
          if (events && events.length > 0) {
            mergeAppleEvents(events);
          }`
);
fs.writeFileSync('src/components/SettingsPage.tsx', settingsContent);

console.log('Done!');
