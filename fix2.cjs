const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');

// 중복 useState 제거
content = content.replace(
  'const [appleCalConnected, setAppleCalConnected] = useState(false);\n  const [appleCalLoading, setAppleCalLoading] = useState(false);\n  const [appleCalConnected, setAppleCalConnected] = useState(false);\n  const [appleCalLoading, setAppleCalLoading] = useState(false);',
  'const [appleCalConnected, setAppleCalConnected] = useState(false);\n  const [appleCalLoading, setAppleCalLoading] = useState(false);'
);

// 중복 함수 제거 (두 번째 것 제거)
const firstEnd = content.indexOf('const handleDisconnectAppleCalendar = () => {');
const secondStart = content.indexOf('const handleConnectAppleCalendar = async () => {', firstEnd + 1);
const secondEnd = content.indexOf('const handleConnectGoogleCalendar', secondStart);
content = content.slice(0, secondStart) + content.slice(secondEnd);

fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
