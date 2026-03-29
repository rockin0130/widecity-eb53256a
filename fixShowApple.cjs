const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');

// Show apple events regardless of showGoogleCalendar
content = content.replace(
  '    if (showGoogleCalendar) {\n      googleCalendarEvents.forEach((ge) => {',
  `    // Always show Apple Calendar events
    googleCalendarEvents.filter(e => e.id.startsWith("apple-")).forEach((ge) => {
      const gcalStart = parseGoogleDateValue(ge.start);
      const gcalEnd = parseGoogleDateValue(ge.end) ?? gcalStart;
      if (!gcalStart) return;
      let rangeEnd = new Date(gcalEnd ?? gcalStart);
      const includeInDate = dateInRange(d, m, y, gcalStart.getDate(), gcalStart.getMonth(), gcalStart.getFullYear(), rangeEnd.getDate(), rangeEnd.getMonth(), rangeEnd.getFullYear());
      if (!includeInDate) return;
      const startMinutes = gcalStart.getHours() * 60 + gcalStart.getMinutes();
      const endMinutes = (gcalEnd ?? gcalStart).getHours() * 60 + (gcalEnd ?? gcalStart).getMinutes();
      items.push({
        id: ge.id, type: "gcal", hour: ge.allDay ? null : minutesToHour(startMinutes),
        endHour: ge.allDay ? null : minutesToHour(endMinutes),
        startDateTime: ge.allDay ? new Date(y, m, d, 0, 0, 0) : gcalStart,
        endDateTime: ge.allDay ? new Date(y, m, d, 23, 59, 59) : (gcalEnd ?? gcalStart),
        allDay: ge.allDay, isMultiDay: false, isStart: true, isEnd: true,
        label: ge.title, color: ge.calendarColor || "#888888",
        calendarColor: ge.calendarColor || null, groupId: null, raw: ge,
      });
    });

    if (showGoogleCalendar) {
      googleCalendarEvents.filter(e => !e.id.startsWith("apple-")).forEach((ge) => {`
);

// Close the extra forEach
content = content.replace(
  '      }); // end googleCalendarEvents.forEach',
  '      });\n      }); // end googleCalendarEvents.forEach'
);

fs.writeFileSync('src/components/CalendarPage.tsx', content);
console.log('Done!');
