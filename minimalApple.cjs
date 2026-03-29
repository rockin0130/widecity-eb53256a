const fs = require('fs');
let cal = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');

// 1. Add import after existing imports
cal = cal.replace(
  'import CalendarsManager from "@/components/CalendarsManager";',
  'import CalendarsManager from "@/components/CalendarsManager";\nimport { requestCalendarPermission, getCalendarEvents } from "../integrations/appleCalendar";'
);

// 2. Add state and useEffect after timeGridRef
cal = cal.replace(
  '  const timeGridRef = useRef<HTMLDivElement>(null);',
  `  const timeGridRef = useRef<HTMLDivElement>(null);
  const [appleEvents, setAppleEvents] = useState<any[]>([]);
  const appleLoadedRef = useRef(false);
  useEffect(() => {
    if (appleLoadedRef.current) return;
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
  }, []);`
);

// 3. Add apple events to getItemsForDate - find the exact items.sort line
const sortLine = '      items.sort((a, b) => {';
cal = cal.replace(sortLine,
  `      appleEvents.forEach((ae) => {
        try {
          const s = new Date(ae.startDate);
          const e2 = new Date(ae.endDate);
          if (!dateInRange(d,m,y,s.getDate(),s.getMonth(),s.getFullYear(),e2.getDate(),e2.getMonth(),e2.getFullYear())) return;
          const sm = s.getHours()*60+s.getMinutes();
          const em = e2.getHours()*60+e2.getMinutes();
          items.push({
            id:"apple-"+ae.id, title:ae.title, time:s.toISOString(),
            allDay:ae.allDay, hour:ae.allDay?null:minutesToHour(sm),
            endHour:ae.allDay?null:minutesToHour(em),
            assignee:"me" as const, groupId:null, type:"gcal" as const,
            raw:{id:"apple-"+ae.id,title:ae.title,description:null,
              start:s.toISOString(),end:e2.toISOString(),allDay:ae.allDay,
              location:ae.location||null,htmlLink:"",
              calendarColor:ae.calendarColor||"#888888",isApple:true} as any,
            done:false,
            startDateTime:ae.allDay?new Date(y,m,d,0,0,0):s,
            endDateTime:ae.allDay?new Date(y,m,d,23,59,59):e2,
            calendarColor:ae.calendarColor||"#888888",
          });
        } catch(e) {}
      });

      ${sortLine}`
);

// 4. Add appleEvents to dependency array
cal = cal.replace(
  '  }, [filteredEvents, filteredTasks, googleCalendarEvents, showGoogleCalendar]);',
  '  }, [filteredEvents, filteredTasks, googleCalendarEvents, showGoogleCalendar, appleEvents]);'
);

fs.writeFileSync('src/components/CalendarPage.tsx', cal);
console.log('Done!');
