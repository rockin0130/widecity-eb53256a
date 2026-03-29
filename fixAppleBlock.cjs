const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');

const oldAppleBlock = `        // Always show Apple Calendar events
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
    });`;

const newAppleBlock = `    // Always show Apple Calendar events
    googleCalendarEvents.filter(e => e.id.startsWith("apple-")).forEach((ge) => {
      const gcalStart = parseGoogleDateValue(ge.start);
      const gcalEnd = parseGoogleDateValue(ge.end) ?? gcalStart;
      if (!gcalStart || !gcalEnd) return;
      const rangeEnd = new Date(gcalEnd);
      const includeInDate = dateInRange(d, m, y, gcalStart.getDate(), gcalStart.getMonth(), gcalStart.getFullYear(), rangeEnd.getDate(), rangeEnd.getMonth(), rangeEnd.getFullYear());
      if (!includeInDate) return;
      const startMinutes = gcalStart.getHours() * 60 + gcalStart.getMinutes();
      const endMinutes = gcalEnd.getHours() * 60 + gcalEnd.getMinutes();
      items.push({
        id: ge.id,
        type: "gcal",
        hour: ge.allDay ? null : minutesToHour(startMinutes),
        endHour: ge.allDay ? null : minutesToHour(endMinutes),
        startDateTime: ge.allDay ? new Date(y, m, d, 0, 0, 0, 0) : gcalStart,
        endDateTime: ge.allDay ? new Date(y, m, d, 23, 59, 59, 999) : gcalEnd,
        allDay: ge.allDay,
        isMultiDay: false,
        isStart: true,
        isEnd: true,
        label: ge.title,
        color: ge.calendarColor || "#888888",
        calendarColor: ge.calendarColor || null,
        groupId: null,
        raw: ge,
        time: ge.start || "All day",
        assignee: "me",
        done: false,
      });
    });`;

content = content.replace(oldAppleBlock, newAppleBlock);
fs.writeFileSync('src/components/CalendarPage.tsx', content);
console.log('Done!');
