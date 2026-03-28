const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');
content = content.replace(
  'import { useState, useEffect } from "react";',
  'import { useState, useEffect } from "react";\nimport { requestCalendarPermission } from "../integrations/appleCalendar";'
);
content = content.replace(
  'const { requestCalendarPermission } = await import(\'../integrations/appleCalendar\');\n      const result = await requestCalendarPermission();',
  'const result = await requestCalendarPermission();'
);
fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
