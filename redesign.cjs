const fs = require('fs');

// 1. Clean up AppContext - remove all apple-related code
let appContent = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Remove AppleCalendarEvent interface
appContent = appContent.replace(/export interface AppleCalendarEvent \{[\s\S]*?\}\n\n/, '');

// Remove appleCalendarEvents from context type
appContent = appContent.replace(/\n  appleCalendarEvents: AppleCalendarEvent\[\];\n  setAppleCalendarEvents: \(events: AppleCalendarEvent\[\]\) => void;\n  mergeAppleEvents: \(events: AppleCalendarEvent\[\]\) => void;/, '');

// Remove isApple from GoogleCalendarEvent
appContent = appContent.replace('\n  isApple?: boolean;', '');

// Remove appleCalendarEvents useState
appContent = appContent.replace('\n  const [appleCalendarEvents, setAppleCalendarEvents] = useState<AppleCalendarEvent[]>([]);', '');

// Remove appleEventsRef if exists
appContent = appContent.replace('\n  const appleEventsRef = useRef<GoogleCalendarEvent[]>([]);', '');

// Remove apple from context return value
appContent = appContent.replace('\n      appleCalendarEvents, setAppleCalendarEvents,', '');

// Remove mergeAppleEvents from context return
const mergeStart = appContent.indexOf('      mergeAppleEvents: (events: AppleCalendarEvent[]) => {');
const mergeEnd = appContent.indexOf('      },\n      partnerHabits');
if (mergeStart !== -1 && mergeEnd !== -1) {
  appContent = appContent.slice(0, mergeStart) + appContent.slice(mergeEnd + 8);
}

// Fix setGoogleCalendarEvents to not worry about apple anymore
appContent = appContent.replace(
  `        setGoogleCalendarEvents(() => {
          const newMap = new Map();
          [...enriched, ...appleEventsRef.current].forEach(e => {
            newMap.set(e.id, e);
          });
          return Array.from(newMap.values());
        });`,
  '        setGoogleCalendarEvents(enriched);'
);

appContent = appContent.replace(
  `        setGoogleCalendarEvents((prev) => {
          const appleEvents = prev.filter((e) => e.id.startsWith("apple-"));
          const newMap = new Map();

          [...enriched, ...appleEvents].forEach(e => {
            newMap.set(e.id, e);
          });

          return Array.from(newMap.values());
        });`,
  '        setGoogleCalendarEvents(enriched);'
);

appContent = appContent.replace(
  '      setGoogleCalendarEvents((prev) => prev.filter((e) => e.id.startsWith("apple-")));',
  '      setGoogleCalendarEvents([]);'
);

fs.writeFileSync('src/context/AppContext.tsx', appContent);
console.log('AppContext cleaned!');

// 2. Clean up Index.tsx - remove apple auto-load
let indexContent = fs.readFileSync('src/pages/Index.tsx', 'utf8');
indexContent = indexContent.replace(
  '\nimport { requestCalendarPermission, getCalendarEvents } from "../integrations/appleCalendar";\nimport { useAppContext } from "@/context/AppContext";',
  ''
);
indexContent = indexContent.replace(
  'import { useState, useCallback, useEffect, useRef } from "react";',
  'import { useState, useCallback, useEffect } from "react";'
);

const appleEffectStart = indexContent.indexOf('  const { mergeAppleEvents } = useAppContext();');
const appleEffectEnd = indexContent.indexOf('  }, [user]);', appleEffectStart) + '  }, [user]);'.length;
if (appleEffectStart !== -1) {
  indexContent = indexContent.slice(0, appleEffectStart) + indexContent.slice(appleEffectEnd + 1);
}

fs.writeFileSync('src/pages/Index.tsx', indexContent);
console.log('Index.tsx cleaned!');

// 3. Clean up SettingsPage - remove apple auto-load useEffect
let settingsContent = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');
settingsContent = settingsContent.replace(
  'import { useAppContext } from "@/context/AppContext";',
  ''
);
settingsContent = settingsContent.replace(
  '\n  const { setAppleCalendarEvents, mergeAppleEvents } = useAppContext();',
  ''
);
settingsContent = settingsContent.replace(
  `        const events = await getCalendarEvents(now, nextYear);
          if (events && events.length > 0) {
            toast("Merging " + events.length + " events");
            mergeAppleEvents(events);
          setTimeout(() => toast("After 2s: check calendar"), 2000);
          }`,
  `        // Events will be loaded by CalendarPage directly`
);
fs.writeFileSync('src/components/SettingsPage.tsx', settingsContent);
console.log('SettingsPage cleaned!');

console.log('All cleaned!');
