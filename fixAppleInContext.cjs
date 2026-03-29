const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Add auto-load Apple Calendar in AppContext after appleCalendarEvents useState
content = content.replace(
  '  const [appleCalendarEvents, setAppleCalendarEvents] = useState<AppleCalendarEvent[]>([]);',
  `  const [appleCalendarEvents, setAppleCalendarEvents] = useState<AppleCalendarEvent[]>([]);
  const appleEventsLoadedRef = useRef(false);

  // Auto-load Apple Calendar events on mount
  useEffect(() => {
    if (appleEventsLoadedRef.current) return;
    const loadApple = async () => {
      try {
        const { requestCalendarPermission, getCalendarEvents } = await import('../integrations/appleCalendar');
        const result = await requestCalendarPermission();
        if (result.result === 'granted') {
          const now = new Date();
          const nextYear = new Date();
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          const events = await getCalendarEvents(now, nextYear);
          if (events && events.length > 0) {
            appleEventsLoadedRef.current = true;
            setAppleCalendarEvents(events);
          }
        }
      } catch (e) {
        // Not on iOS or permission not granted
      }
    };
    loadApple();
  }, []);`
);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log('Done!');
