const fs = require('fs');

function patchAppleCalendar() {
  const path = 'src/integrations/appleCalendar.ts';
  let text = fs.readFileSync(path, 'utf8');

  if (!text.includes('[APPLE_DEBUG]')) {
    text = text.replace(
      /const events = .*?;/,
      match => `${match}\n  console.log("[APPLE_DEBUG] raw fetched events:", events);`
    );

    text = text.replace(
      /return .*?events.*?;/,
      match => `console.log("[APPLE_DEBUG] returning apple events:", Array.isArray(events) ? events.length : events);\n  ${match}`
    );
  }

  fs.writeFileSync(path, text);
  console.log('Patched appleCalendar.ts');
}

function patchAppContext() {
  const path = 'src/context/AppContext.tsx';
  let text = fs.readFileSync(path, 'utf8');

  if (!text.includes('[APPLE_CONTEXT_DEBUG]')) {
    text = text.replace(
      /const .*apple.*=.*useState.*\n/g,
      match => match
    );

    text = text.replace(
      /set[A-Za-z0-9_]*apple[A-Za-z0-9_]*\((.*?)\);/g,
      match => `${match}\nconsole.log("[APPLE_CONTEXT_DEBUG] state set:", $1);`
    );

    if (!text.includes('APPLE_CONTEXT_DEBUG_EFFECT')) {
      text = text.replace(
        /return\s*\(\s*<AppContext\.Provider/s,
        `console.log("[APPLE_CONTEXT_DEBUG] AppContext rendered");\n\nreturn (<AppContext.Provider`
      );
    }
  }

  fs.writeFileSync(path, text);
  console.log('Patched AppContext.tsx');
}

try { patchAppleCalendar(); } catch (e) { console.log('appleCalendar patch skipped:', e.message); }
try { patchAppContext(); } catch (e) { console.log('AppContext patch skipped:', e.message); }
