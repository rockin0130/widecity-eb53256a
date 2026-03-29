const fs = require('fs');

const file = 'src/context/AppContext.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
`      // Add fallback calendar metadata for proper UI grouping
      calendarTitle: ae.calendarTitle || ae.calendarId || "Apple",
      calendarId: ae.calendarId || "apple-default",
      // Add fallback calendar metadata for proper UI grouping
      calendarTitle: ae.calendarTitle || ae.calendarId || "Apple",
      calendarId: ae.calendarId || "apple-default",`,
`      // Add fallback calendar metadata for proper UI grouping
      calendarTitle: ae.calendarTitle || ae.calendarId || "Apple",
      calendarId: ae.calendarId || "apple-default",`
);

content = content.replace(
`          // Add fallback calendar metadata for proper UI grouping
          calendarTitle: ae.calendarTitle || ae.calendarId || "Apple",
          calendarId: ae.calendarId || "apple-default",
          // Add fallback calendar metadata for proper UI grouping
          calendarTitle: ae.calendarTitle || ae.calendarId || "Apple",
          calendarId: ae.calendarId || "apple-default",`,
`          // Add fallback calendar metadata for proper UI grouping
          calendarTitle: ae.calendarTitle || ae.calendarId || "Apple",
          calendarId: ae.calendarId || "apple-default",`
);

fs.writeFileSync(file, content);
console.log('Duplicate Apple calendar metadata removed');
