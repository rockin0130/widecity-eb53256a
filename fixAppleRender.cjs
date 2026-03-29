const fs = require('fs');

const path = 'src/components/CalendarPage.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. useAppContext destructuring에 appleCalendarEvents 추가
content = content.replace(
`    googleCalendarEvents, hideGcalEvent, toggleGcalCompletion, toggleEventVisibility, designateGcalEvent,`,
`    googleCalendarEvents, appleCalendarEvents, hideGcalEvent, toggleGcalCompletion, toggleEventVisibility, designateGcalEvent,`
);

// 2. gcal loop 전에 apple events loop 추가
content = content.replace(
`    if (showGoogleCalendar) {
      googleCalendarEvents.forEach((ge) => {`,
`    if (showGoogleCalendar) {

      // Apple events
      appleCalendarEvents.forEach((ae) => {
        const start = new Date(ae.startDate);
        const end = new Date(ae.endDate);

        const include = dateInRange(
          d, m, y,
          start.getDate(), start.getMonth(), start.getFullYear(),
          end.getDate(), end.getMonth(), end.getFullYear()
        );

        if (!include) return;

        items.push({
          id: "apple-" + ae.id,
          title: ae.title,
          time: start.toISOString(),
          allDay: ae.allDay,
          hour: ae.allDay ? null : start.getHours(),
          endHour: ae.allDay ? null : end.getHours(),
          assignee: "me",
          type: "gcal",
          raw: {
            ...ae,
            isApple: true,
            start: start.toISOString(),
            end: end.toISOString()
          },
          startDateTime: start,
          endDateTime: end,
          calendarColor: ae.calendarColor || "#888888"
        });
      });

      // Google events
      googleCalendarEvents.forEach((ge) => {`
);

fs.writeFileSync(path, content);
console.log("Apple render fix applied");
