const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsPage.tsx', 'utf8');
content = content.replace(
  `toast("requestCalendarPermission 호출!");\n      const result = await requestCalendarPermission();\n      toast("결과: " + JSON.stringify(result));`,
  `const result = await requestCalendarPermission();\n      if (result.result === 'granted') {\n        setAppleCalConnected(true);\n        toast.success("Apple Calendar connected!");\n        return;\n      }`
);
content = content.replace(`toast("버튼 눌림!");\n    `, '');
content = content.replace(`toast("권한 요청 시도 중...");\n`, '');
fs.writeFileSync('src/components/SettingsPage.tsx', content);
console.log('Done!');
