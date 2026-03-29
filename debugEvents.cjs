const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');
content = content.replace(
  '        const events = await getCalendarEvents(now, nextYear);\n        if (events) setAppleCalendarEvents(events);',
  `        try {
          const events = await getCalendarEvents(now, nextYear);
          toast("Events count: " + (events?.length ?? "null"));
          if (events && events.length > 0) {
            setAppleCalendarEvents(events);
            toast("First id: " + events[0].id);
          }
        } catch(e) {
          toast("getCalendarEvents error: " + e.message);
        }`
);
fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
