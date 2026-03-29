const fs = require('fs');

const file = 'src/components/CalendarPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
/\{item\.type === "gcal" && <GoogleBadge \/>\}/g,
'{item.type === "gcal" && ((item.raw as any)?.isApple ? <AppleBadge /> : <GoogleBadge />)}'
);

fs.writeFileSync(file, content);
console.log('Updated badge usage');
