const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Remove the appleCalendarEvents useEffect entirely
const start = content.indexOf('  // Merge Apple Calendar events into Google Calendar format when they change');
const end = content.indexOf('  }, [appleCalendarEvents]);') + '  }, [appleCalendarEvents]);'.length;
if (start !== -1 && end !== -1) {
  content = content.slice(0, start) + content.slice(end + 1);
}

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log('Done!');
