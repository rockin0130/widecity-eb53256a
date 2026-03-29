const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Persist appleCalendarEvents to localStorage
content = content.replace(
  '  const [appleCalendarEvents, setAppleCalendarEvents] = useState<AppleCalendarEvent[]>([]);',
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
  }, [appleCalendarEvents]);`
);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log('Done!');
