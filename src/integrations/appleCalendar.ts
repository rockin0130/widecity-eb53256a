import { CapacitorCalendar } from '@ebarooni/capacitor-calendar';

// 캘린더 접근 권한 요청
export async function requestCalendarPermission() {
  const result = await CapacitorCalendar.requestPermissions({
    alias: 'readCalendar',
  });
  return result;
}

// 캘린더 이벤트 가져오기
export async function getCalendarEvents(startDate: Date, endDate: Date) {
  const events = await CapacitorCalendar.listEventsInRange({
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
  });
  return events.result;
}

// 캘린더 이벤트 추가
export async function addCalendarEvent(
  title: string,
  startDate: Date,
  endDate: Date,
) {
  const result = await CapacitorCalendar.createEventWithPrompt({
    title,
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
  });
  return result;
}