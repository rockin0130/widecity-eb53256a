const fs = require('fs');

const file = 'src/components/CalendarPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
`      {/* ── Group Selector ──────────────────────────────── */}
      <div className="mb-2">
        <GroupSelector />
      </div>`,
``
);

fs.writeFileSync(file, content);
console.log('GroupSelector row removed');
