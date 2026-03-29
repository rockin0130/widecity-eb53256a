import { CapacitorCalendar } from '@ebarooni/capacitor-calendar';
import type { AppleCalendarEvent } from '@/context/AppContext';

export async function requestCalendarPermission() {
  const result = await CapacitorCalendar.requestFullCalendarAccess();
  return result;
}

/** Maps plugin {@link CalendarEvent} fields to our app shape (`isAllDay` → `allDay`). */
export async function getCalendarEvents(startDate: Date, endDate: Date): Promise<AppleCalendarEvent[]> {
  const { result } = await CapacitorCalendar.listEventsInRange({
    from: startDate.getTime(),
    to: endDate.getTime(),
  });
  const list = result ?? [];
  return list.map((e) => ({
    id: e.id,
    title: e.title ?? '',
    startDate: e.startDate,
    endDate: e.endDate,
    allDay: e.isAllDay,
    location: e.location,
    calendarId: e.calendarId ?? undefined,
    calendarColor: e.color ?? undefined,
  }));
}

export async function addCalendarEvent(title: string, startDate: Date, endDate: Date) {
  const result = await CapacitorCalendar.createEventWithPrompt({
    title,
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
  });
  return result;
}