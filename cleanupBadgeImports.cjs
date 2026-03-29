const fs = require('fs');

const file = 'src/components/CalendarPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('import AppleBadge from "@/components/AppleBadge";\n', '');
content = content.replace('import GoogleBadge from "@/components/GoogleBadge";\n', '');

fs.writeFileSync(file, content);
console.log('Removed badge imports');
