const fs = require('fs');
let cal = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');

cal = cal.replace(
  `  const appleLoadedRef = useRef(false);
  useEffect(() => {
    requestCalendarPermission()
      .then((result) => {
        if (result.result !== 'granted') return;
        appleLoadedRef.current = true;
        const now = new Date();
        const next = new Date();
        next.setFullYear(next.getFullYear() + 1);
        return getCalendarEvents(now, next);
      })
      .then((events) => { if (events) setAppleEvents(events); })
      .catch(() => {});
  }, []);`,
  `  const appleLoadedRef = useRef(false);
  useEffect(() => {
    const { toast } = require('sonner');
    requestCalendarPermission()
      .then((result) => {
        toast('Permission: ' + result.result);
        if (result.result !== 'granted') return;
        const now = new Date();
        const next = new Date();
        next.setFullYear(next.getFullYear() + 1);
        return getCalendarEvents(now, next);
      })
      .then((events) => {
        toast('Events: ' + (events?.length ?? 'null'));
        if (events) setAppleEvents(events);
      })
      .catch((e) => { toast('Error: ' + e.message); });
  }, []);`
);

fs.writeFileSync('src/components/CalendarPage.tsx', cal);
console.log('Done!');
