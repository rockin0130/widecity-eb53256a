const fs = require('fs');

let cal = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');

// Add appleCalendarEvents to useAppContext destructuring
cal = cal.replace(
  '    googleCalendarEvents,\n    hideGcalEvent,\n    toggleGcalCompletion,\n    toggleEventVisibility,\n    designateGcalEvent,\n    toggleEventCompletion,',
  '    googleCalendarEvents,\n    hideGcalEvent,\n    toggleGcalCompletion,\n    toggleEventVisibility,\n    designateGcalEvent,\n    toggleEventCompletion,\n    appleCalendarEvents,'
);

// Add Apple Calendar events directly in getItemsForDate before sort
cal = cal.replace(
  '      items.sort((a, b) => {',
  `      // Render Apple Calendar events directly from appleCalendarEvents state
      if (Array.isArray(appleCalendarEvents)) {
        appleCalendarEvents.forEach((ae) => {
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
      }

      items.sort((a, b) => {`
);

// Add appleCalendarEvents to useMemo dependency array
cal = cal.replace(
  '  }, [filteredEvents, filteredTasks, googleCalendarEvents, showGoogleCalendar]);',
  '  }, [filteredEvents, filteredTasks, googleCalendarEvents, showGoogleCalendar, appleCalendarEvents]);'
);

fs.writeFileSync('src/components/CalendarPage.tsx', cal);
console.log('Done!');
