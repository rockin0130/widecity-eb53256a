import { CapacitorCalendar } from '@ebarooni/capacitor-calendar';

export async function requestCalendarPermission() {
  const result = await CapacitorCalendar.requestFullCalendarAccess();
  return result;
}

export async function getCalendarEvents(startDate: Date, endDate: Date) {
  const events = await CapacitorCalendar.listEventsInRange({
    from: startDate.getTime(),
    to: endDate.getTime(),
  });
  return events.result;
}

export async function addCalendarEvent(title: string, startDate: Date, endDate: Date) {
  const result = await CapacitorCalendar.createEventWithPrompt({
    title,
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
  });
  return result;
}