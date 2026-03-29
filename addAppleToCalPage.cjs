const fs = require('fs');
let cal = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');

// Add import for apple calendar
cal = cal.replace(
  'import { useState, useMemo, useCallback, useRef, useEffect } from "react";',
  'import { useState, useMemo, useCallback, useRef, useEffect } from "react";\nimport { requestCalendarPermission, getCalendarEvents } from "../integrations/appleCalendar";\nimport type { AppleCalendarEvent } from "../context/AppContext";'
);

// Wait - AppleCalendarEvent was removed from AppContext. Define it locally instead
cal = cal.replace(
  'import { requestCalendarPermission, getCalendarEvents } from "../integrations/appleCalendar";\nimport type { AppleCalendarEvent } from "../context/AppContext";',
  'import { requestCalendarPermission, getCalendarEvents } from "../integrations/appleCalendar";'
);

// Add local AppleCalendarEvent type and state after existing useState declarations
cal = cal.replace(
  '  const [showCalendarsManager, setShowCalendarsManager] = useState(false);',
  `  const [showCalendarsManager, setShowCalendarsManager] = useState(false);
  const [appleEvents, setAppleEvents] = useState<any[]>([]);

  // Load Apple Calendar events on mount
  useEffect(() => {
    const loadApple = async () => {
      try {
        const result = await requestCalendarPermission();
        if (result.result === 'granted') {
          const now = new Date();
          const nextYear = new Date();
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          const events = await getCalendarEvents(now, nextYear);
          if (events && events.length > 0) {
            setAppleEvents(events);
          }
        }
      } catch (e) {
        // Not on iOS or no permission
      }
    };
    loadApple();
  }, []);`
);

// Add apple events rendering in getItemsForDate before items.sort
cal = cal.replace(
  '      items.sort((a, b) => {',
  `      // Render Apple Calendar events
      appleEvents.forEach((ae) => {
        const appleStart = new Date(ae.startDate);
        const appleEnd = new Date(ae.endDate);
        const includeInDate = dateInRange(
          d, m, y,
          appleStart.getDate(), appleStart.getMonth(), appleStart.getFullYear(),
          appleEnd.getDate(), appleEnd.getMonth(), appleEnd.getFullYear()
        );
        if (!includeInDate) return;
        const startMinutes = appleStart.getHours() * 60 + appleStart.getMinutes();
        const endMinutes = appleEnd.getHours() * 60 + appleEnd.getMinutes();
        items.push({
          id: "apple-" + ae.id,
          title: ae.title,
          time: appleStart.toISOString(),
          allDay: ae.allDay,
          hour: ae.allDay ? null : minutesToHour(startMinutes),
          endHour: ae.allDay ? null : minutesToHour(endMinutes),
          assignee: "me" as const,
          groupId: null,
          type: "gcal" as const,
          raw: { id: "apple-" + ae.id, title: ae.title, description: null, start: appleStart.toISOString(), end: appleEnd.toISOString(), allDay: ae.allDay, location: ae.location || null, htmlLink: "", calendarColor: ae.calendarColor || "#888888", isApple: true } as any,
          done: false,
          startDateTime: ae.allDay ? new Date(y, m, d, 0, 0, 0) : appleStart,
          endDateTime: ae.allDay ? new Date(y, m, d, 23, 59, 59) : appleEnd,
          calendarColor: ae.calendarColor || "#888888",
        });
      });

      items.sort((a, b) => {`
);

// Add appleEvents to dependency array
cal = cal.replace(
  '  }, [filteredEvents, filteredTasks, googleCalendarEvents, showGoogleCalendar]);',
  '  }, [filteredEvents, filteredTasks, googleCalendarEvents, showGoogleCalendar, appleEvents]);'
);

fs.writeFileSync('src/components/CalendarPage.tsx', cal);
console.log('Done!');
