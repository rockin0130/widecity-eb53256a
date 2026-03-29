const fs = require('fs');

const path = 'src/integrations/appleCalendar.ts';
let text = fs.readFileSync(path, 'utf8');

text = `
import { CapacitorCalendar } from '@ebarooni/capacitor-calendar';

export async function requestCalendarPermission() {
  const result = await CapacitorCalendar.requestFullCalendarAccess();
  return result;
}

export async function getCalendarEvents(startDate: Date, endDate: Date) {
  const res = await CapacitorCalendar.listEventsInRange({
    from: startDate.getTime(),
    to: endDate.getTime(),
  });

  const raw = res.result || [];

  console.log("[APPLE_DEBUG] raw count:", raw.length);

  const mapped = raw.map((e) => {
    const start = new Date(e.startDate);

    return {
      id: String(e.id),
      title: e.title || "Untitled",
      time: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      day: start.getDate(),
      month: start.getMonth() + 1,
      year: start.getFullYear(),

      calendarId: e.calendar || "apple-default",
      calendarTitle: e.calendar || "Apple",
      calendarColor: "#888888",
    };
  });

  console.log("[APPLE_DEBUG] mapped sample:", mapped.slice(0,2));

  return mapped;
}

export async function addCalendarEvent(title, startDate, endDate) {
  const result = await CapacitorCalendar.createEventWithPrompt({
    title,
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
  });

  return result;
}
`;

fs.writeFileSync(path, text);
console.log("Fixed appleCalendar mapping");
