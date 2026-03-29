const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Add AppleCalendarEvent interface
content = content.replace(
  'interface AppContextType {',
  `export interface AppleCalendarEvent {
  id: string;
  title: string;
  startDate: number;
  endDate: number;
  allDay: boolean;
  location?: string | null;
  calendarId?: string;
  calendarTitle?: string;
  calendarColor?: string | null;
}

interface AppContextType {`
);

// Add to context type
content = content.replace(
  '  googleCalendarEvents: GoogleCalendarEvent[];',
  '  googleCalendarEvents: GoogleCalendarEvent[];\n  appleCalendarEvents: AppleCalendarEvent[];\n  setAppleCalendarEvents: (events: AppleCalendarEvent[]) => void;'
);

// Add useState
content = content.replace(
  'const [googleCalendarEvents, setGoogleCalendarEvents] = useState<GoogleCalendarEvent[]>([]);',
  'const [googleCalendarEvents, setGoogleCalendarEvents] = useState<GoogleCalendarEvent[]>([]);\n  const [appleCalendarEvents, setAppleCalendarEvents] = useState<AppleCalendarEvent[]>([]);'
);

// Add to context return value
content = content.replace(
  'googleCalendarEvents, hideGcalEvent, toggleGcalCompletion, toggleEventVisibility, designateGcalEvent,',
  'googleCalendarEvents, hideGcalEvent, toggleGcalCompletion, toggleEventVisibility, designateGcalEvent,\n      appleCalendarEvents, setAppleCalendarEvents,'
);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log('Done!');
