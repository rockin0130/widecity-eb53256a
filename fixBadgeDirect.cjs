const fs = require('fs');
let content = fs.readFileSync('src/components/CalendarPage.tsx', 'utf8');

content = content.replace(
  /item\.id\?\.startsWith\("apple-"\) \? <AppleBadge \/> : <GoogleBadge \/>/g,
  '(item.raw as any)?.isApple ? <AppleBadge /> : <GoogleBadge />'
);

fs.writeFileSync('src/components/CalendarPage.tsx', content);
console.log('Done!');
