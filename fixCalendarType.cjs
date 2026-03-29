const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');

// 1. Add AppleCalendarEvent to import
content = content.replace(
  'import { useAppContext, Task, ScheduledEvent, GoogleCalendarEvent, AppleCalendarEvent } from "@/context/AppContext";',
  'import { useAppContext, Task, ScheduledEvent, GoogleCalendarEvent, AppleCalendarEvent } from "@/context/AppContext";'
);

// 2. Add "apple" to type union
content = content.replace(
  '  type: "event" | "task" | "gcal";',
  '  type: "event" | "task" | "gcal" | "apple";'
);

// 3. Add AppleCalendarEvent to raw union
content = content.replace(
  '  raw: ScheduledEvent | Task | GoogleCalendarEvent;',
  '  raw: ScheduledEvent | Task | GoogleCalendarEvent | AppleCalendarEvent;'
);

fs.writeFileSync('src/components/CalendarPage.tsx', content);
console.log('Done!');
