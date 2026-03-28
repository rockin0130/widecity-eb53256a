const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');
content = content.replace(
  'toast("버튼 눌림!");\n    try {',
  'toast("버튼 눌림!");\n    try {\n      toast("권한 요청 시도 중...");\n'
);
content = content.replace(
  'const result = await requestCalendarPermission();',
  'toast("requestCalendarPermission 호출!");\n      const result = await requestCalendarPermission();\n      toast("결과: " + JSON.stringify(result));'
);
fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
