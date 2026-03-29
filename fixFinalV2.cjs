const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// 1. Add useEffect to merge apple events into google events
content = content.replace(
  '  const [appleCalendarEvents, setAppleCalendarEvents] = useState<AppleCalendarEvent[]>([]);',
  `  const [appleCalendarEvents, setAppleCalendarEvents] = useState<AppleCalendarEvent[]>([]);

  useEffect(() => {
    if (appleCalendarEvents.length === 0) return;
    const converted = appleCalendarEvents.map((ae) => ({
      isApple: true,
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
  }, [appleCalendarEvents]);`
);

// 2. When Google Calendar reloads, preserve apple events
content = content.replace(
  '        setGoogleCalendarEvents(enriched);',
  `        setGoogleCalendarEvents((prev) => {
          const appleEvents = prev.filter((e) => e.id.startsWith("apple-"));
          return [...enriched, ...appleEvents];
        });`
);

content = content.replace(
  '      setGoogleCalendarEvents([]);',
  `      setGoogleCalendarEvents((prev) => prev.filter((e) => e.id.startsWith("apple-")));`
);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log('Done!');
