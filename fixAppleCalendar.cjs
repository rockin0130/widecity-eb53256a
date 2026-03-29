const fs = require('fs');

const file = 'src/context/AppContext.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix 1: Ensure Apple events include calendarTitle and calendarId
// Without this, Apple calendar chips will not render because they are filtered out
content = content.replace(
  /isApple: true,\n\s*source: "apple",\n\s*id: ae\.id,/g,
`isApple: true,
  source: "apple",
      id: ae.id,
      // Add fallback calendar metadata for proper UI grouping
      calendarTitle: ae.calendarTitle || ae.calendarId || "Apple",
      calendarId: ae.calendarId || "apple-default",`
);

// Fix 2: Apply same logic in mergeAppleEvents function
// This ensures consistency when Apple events are manually merged
content = content.replace(
  /isApple: true,\n\s*id: "apple-" \+ ae\.id,/g,
`isApple: true,
          id: "apple-" + ae.id,
          // Add fallback calendar metadata for proper UI grouping
          calendarTitle: ae.calendarTitle || ae.calendarId || "Apple",
          calendarId: ae.calendarId || "apple-default",`
);

fs.writeFileSync(file, content);
console.log('Apple calendar fix applied');
