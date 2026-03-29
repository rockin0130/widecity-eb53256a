const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Replace localStorage version with simple useState
content = content.replace(
  `  const [appleCalendarEvents, setAppleCalendarEvents] = useState<AppleCalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('appleCalendarEvents');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Save to localStorage whenever apple events change
  useEffect(() => {
    try {
      localStorage.setItem('appleCalendarEvents', JSON.stringify(appleCalendarEvents));
    } catch {}
  }, [appleCalendarEvents]);`,
  `  const [appleCalendarEvents, setAppleCalendarEvents] = useState<AppleCalendarEvent[]>([]);

  // Merge Apple Calendar events into Google Calendar format when they change
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
