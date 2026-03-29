const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');

// Add useEffect to auto-load Apple Calendar on mount
content = content.replace(
  '  const { setAppleCalendarEvents, mergeAppleEvents } = useAppContext();',
  `  const { setAppleCalendarEvents, mergeAppleEvents } = useAppContext();

  // Auto-load Apple Calendar events on mount if permission already granted
  useEffect(() => {
    const autoLoadAppleCalendar = async () => {
      try {
        const result = await requestCalendarPermission();
        if (result.result === 'granted') {
          setAppleCalConnected(true);
          const now = new Date();
          const nextYear = new Date();
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          const events = await getCalendarEvents(now, nextYear);
          if (events && events.length > 0) {
            mergeAppleEvents(events);
          }
        }
      } catch (err) {
        // Permission not granted yet, ignore
      }
    };
    autoLoadAppleCalendar();
  }, []);`
);

fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
