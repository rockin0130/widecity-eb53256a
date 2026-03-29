const fs = require('fs');

const file = 'src/components/CalendarPage.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1) Add Apple calendar selection state
content = content.replace(
`  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<CalItem | null>(null);`,
`  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<CalItem | null>(null);
  const [selectedAppleCalendars, setSelectedAppleCalendars] = useState<string[]>([]);`
);

// 2) Add Apple calendar list memo
content = content.replace(
`  const [showCalendarsManager, setShowCalendarsManager] = useState(false);
  const timeGridRef = useRef<HTMLDivElement>(null);`,
`  const [showCalendarsManager, setShowCalendarsManager] = useState(false);
  const timeGridRef = useRef<HTMLDivElement>(null);

  const appleCalendarList = useMemo(() => {
    const set = new Set<string>();
    googleCalendarEvents.forEach((e: any) => {
      if (e.isApple) {
        set.add(e.calendarTitle || e.calendarId || "Apple");
      }
    });
    return Array.from(set);
  }, [googleCalendarEvents]);`
);

// 3) Add Apple calendar filtering inside Google/Apple events loop
content = content.replace(
`      if (showGoogleCalendar) {
        googleCalendarEvents.forEach((ge) => {`,
`      if (showGoogleCalendar) {
        googleCalendarEvents.forEach((ge) => {
          if (
            ge.isApple &&
            selectedAppleCalendars.length > 0 &&
            !selectedAppleCalendars.includes(
              (ge as any).calendarTitle || (ge as any).calendarId || "Apple"
            )
          ) {
            return;
          }`
);

// 4) Update dependency array so filter changes actually re-render items
content = content.replace(
`    [filteredEvents, filteredTasks, googleCalendarEvents, showGoogleCalendar]
  );`,
`    [filteredEvents, filteredTasks, googleCalendarEvents, showGoogleCalendar, selectedAppleCalendars]
  );`
);

// 5) Insert Apple calendar chip row under the header controls
content = content.replace(
`      </header>

      {/* ── Group Selector ──────────────────────────────── */}`,
`        <div className="flex gap-2 px-3 py-2 overflow-x-auto">
          <button
            onClick={() => setSelectedAppleCalendars([])}
            className={\`px-3 py-1 rounded-full text-sm whitespace-nowrap \${
              selectedAppleCalendars.length === 0
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }\`}
          >
            All
          </button>

          {appleCalendarList.map((cal) => (
            <button
              key={cal}
              onClick={() => {
                setSelectedAppleCalendars((prev) =>
                  prev.includes(cal)
                    ? prev.filter((c) => c !== cal)
                    : [...prev, cal]
                );
              }}
              className={\`px-3 py-1 rounded-full text-sm whitespace-nowrap \${
                selectedAppleCalendars.includes(cal)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }\`}
            >
              {cal}
            </button>
          ))}
        </div>
      </header>

      {/* ── Group Selector ──────────────────────────────── */}`
);

fs.writeFileSync(file, content);
console.log('Apple filter UI applied to CalendarPage.tsx');
