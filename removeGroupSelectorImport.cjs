const fs = require('fs');

const file = 'src/components/CalendarPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
'import GroupSelector from "@/components/GroupSelector";\n',
''
);

fs.writeFileSync(file, content);
console.log('Removed GroupSelector import');
