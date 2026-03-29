const fs = require('fs');

// 1. Remove autoLoadAppleCalendar from SettingsPage
let settings = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');
settings = settings.replace(
  `  useEffect(() => {
    const autoLoadAppleCalendar = async () => {
      try {
        const result = await requestCalendarPermission();
        if (result.result === 'granted') {
          setAppleCalConnected(true);
          const now = new Date();
          const nextYear = new Date();
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          const events = await getCalendarEvents(now, nextYear);
          if (events && events.length > 0) {
            mergeAppleEvents(events);
          }
        }
      } catch (err) {
        // Permission not granted yet, ignore
      }
    };
    autoLoadAppleCalendar();
  }, []);`,
  ''
);
fs.writeFileSync('src/components/SettingsPage.tsx', settings);

// 2. Add autoLoadAppleCalendar to Index.tsx
let index = fs.readFileSync('src/pages/Index.tsx', 'utf8');

// Add imports
index = index.replace(
  'import { useState, useCallback, useEffect } from "react";',
  'import { useState, useCallback, useEffect, useRef } from "react";\nimport { requestCalendarPermission, getCalendarEvents } from "../integrations/appleCalendar";\nimport { useAppContext } from "@/context/AppContext";'
);

// Add useEffect inside the main component - find a good insertion point
index = index.replace(
  'const SWIPE_THRESHOLD = 80;',
  'const SWIPE_THRESHOLD = 80;'
);

// Find the App component and add the useEffect
index = index.replace(
  'const { loading, user } = useAuth();',
  `const { loading, user } = useAuth();
  const { mergeAppleEvents } = useAppContext();
  const appleLoadedRef = useRef(false);

  useEffect(() => {
    if (appleLoadedRef.current || !user) return;
    const loadApple = async () => {
      try {
        const result = await requestCalendarPermission();
        if (result.result === 'granted') {
          appleLoadedRef.current = true;
          const now = new Date();
          const nextYear = new Date();
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          const events = await getCalendarEvents(now, nextYear);
          if (events && events.length > 0) {
            mergeAppleEvents(events);
          }
        }
      } catch (e) {
        // Not on iOS or no permission
      }
    };
    loadApple();
  }, [user]);`
);

fs.writeFileSync('src/pages/Index.tsx', index);
console.log('Done!');
