const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');
content = content.replace(
  'const [gcalLoading, setGcalLoading] = useState(false);',
  'const [gcalLoading, setGcalLoading] = useState(false);\n  const [appleCalConnected, setAppleCalConnected] = useState(false);\n  const [appleCalLoading, setAppleCalLoading] = useState(false);'
);
content = content.replace(
  'const handleConnectGoogleCalendar',
  'const handleConnectAppleCalendar = async () => {\n    setAppleCalLoading(true);\n    try {\n      const { requestCalendarPermission } = await import("../integrations/appleCalendar");\n      const result = await requestCalendarPermission();\n      setAppleCalConnected(true);\n      toast.success("Apple Calendar connected!");\n    } catch (err) {\n      toast.error("Failed to connect Apple Calendar");\n    }\n    setAppleCalLoading(false);\n  };\n\n  const handleDisconnectAppleCalendar = () => {\n    setAppleCalConnected(false);\n    toast.success("Apple Calendar disconnected");\n  };\n\n  const handleConnectGoogleCalendar'
);
fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
