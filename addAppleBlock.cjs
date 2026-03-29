const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');

content = content.replace(
  '    if (showGoogleCalendar) {',
  `    appleCalendarEvents.forEach((ae) => {
        const appleStart = new Date(ae.startDate);
        const appleEnd = new Date(ae.endDate);
        if (!appleStart || !appleEnd) return;

        const includeInDate = dateInRange(
          d, m, y,
          appleStart.getDate(), appleStart.getMonth(), appleStart.getFullYear(),
          appleEnd.getDate(), appleEnd.getMonth(), appleEnd.getFullYear(),
        );
        if (!includeInDate) return;

        const startMinutes = appleStart.getHours() * 60 + appleStart.getMinutes();
        const endMinutes = appleEnd.getHours() * 60 + appleEnd.getMinutes();

        items.push({
          id: ae.id,
          type: "apple" as const,
          hour: ae.allDay ? null : minutesToHour(startMinutes),
          endHour: ae.allDay ? null : minutesToHour(endMinutes),
          startDateTime: ae.allDay ? new Date(y, m, d, 0, 0, 0) : appleStart,
          endDateTime: ae.allDay ? new Date(y, m, d, 23, 59, 59) : appleEnd,
          allDay: ae.allDay,
          isMultiDay: false,
          isStartDay: true,
          isEndDay: true,
          label: ae.title,
          color: ae.calendarColor || "#888888",
          raw: ae,
        });
      });

    if (showGoogleCalendar) {`
);

fs.writeFileSync('src/components/CalendarPage.tsx', content);
console.log('Done!');
