const fs = require('fs');

const file = 'src/components/CalendarPage.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldState = `  const [showSearch, setShowSearch] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<CalItem | null>(null);
  const [selectedAppleCalendars, setSelectedAppleCalendars] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<{`;

const newState = `  const [showSearch, setShowSearch] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<CalItem | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{`;

if (!content.includes(oldState)) {
  console.log('State block not found');
  process.exit(1);
}
content = content.replace(oldState, newState);

const oldAppleList = `  const [showCalendarsManager, setShowCalendarsManager] = useState(false);
  const timeGridRef = useRef<HTMLDivElement>(null);

  const appleCalendarList = useMemo(() => {
    const set = new Set<string>();
    googleCalendarEvents.forEach((e: any) => {
      if (e.isApple) {
        set.add(e.calendarTitle || e.calendarId || "Apple");
      }
    });
    return Array.from(set);
  }, [googleCalendarEvents]);`;

const newRoomList = `  const [showCalendarsManager, setShowCalendarsManager] = useState(false);
  const timeGridRef = useRef<HTMLDivElement>(null);

  const roomList = useMemo(() => {
    const rooms = new Map();

    const looksLikeUuid = (value) =>
      typeof value === "string" &&
      /^[0-9a-fA-F-]{20,}$/.test(value);

    const addRoom = (id, label, roomType) => {
      if (!id || !label) return;
      if (!rooms.has(id)) {
        rooms.set(id, { id, label, roomType });
      }
    };

    groups.forEach((group) => {
      addRoom(\`app:\${group.id}\`, group.name, "app");
    });

    const hasPersonalAppItems =
      filteredEvents.some((e) => !e.groupId) ||
      filteredTasks.some((t) => !t.groupId);

    if (hasPersonalAppItems) {
      addRoom("app:personal", "My Calendar", "app");
    }

    googleCalendarEvents.forEach((e) => {
      if (e.isApple) {
        const rawLabel =
          (e).calendarTitle ||
          (e).calendarName ||
          "";
        const safeLabel =
          rawLabel && !looksLikeUuid(rawLabel) ? rawLabel : "Apple Calendar";
        const safeId =
          "apple:" +
          (((e).calendarId || rawLabel || "default").toString());
        addRoom(safeId, safeLabel, "apple");
      } else {
        const rawLabel =
          (e).calendarTitle ||
          (e).calendarName ||
          "Google Calendar";
        const safeLabel =
          rawLabel && !looksLikeUuid(rawLabel) ? rawLabel : "Google Calendar";
        const safeId =
          "google:" +
          (((e).calendarId || rawLabel || "default").toString());
        addRoom(safeId, safeLabel, "google");
      }
    });

    return Array.from(rooms.values());
  }, [groups, filteredEvents, filteredTasks, googleCalendarEvents]);`;

if (!content.includes(oldAppleList)) {
  console.log('Apple list block not found');
  process.exit(1);
}
content = content.replace(oldAppleList, newRoomList);

const insertHelperAfter = `  const getGroupName = (groupId: string | null | undefined) =>
    groupId ? groups.find((g) => g.id === groupId) : null;`;

const helperBlock = `  const getGroupName = (groupId: string | null | undefined) =>
    groupId ? groups.find((g) => g.id === groupId) : null;

  const getRoomMeta = useCallback(
    (item: ScheduledEvent | Task | GoogleCalendarEvent, type: "event" | "task" | "gcal") => {
      if (type === "event" || type === "task") {
        const appItem = item as ScheduledEvent | Task;
        if (appItem.groupId) {
          const matchedGroup = groups.find((g) => g.id === appItem.groupId);
          return {
            roomId: \`app:\${appItem.groupId}\`,
            roomLabel: matchedGroup?.name || "Shared Room",
            roomType: "app",
          };
        }
        return {
          roomId: "app:personal",
          roomLabel: "My Calendar",
          roomType: "app",
        };
      }

      const gcalItem = item as GoogleCalendarEvent;
      const rawLabel =
        (gcalItem).calendarTitle ||
        (gcalItem).calendarName ||
        "";
      const looksLikeUuid =
        typeof rawLabel === "string" && /^[0-9a-fA-F-]{20,}$/.test(rawLabel);

      if ((gcalItem).isApple) {
        return {
          roomId: "apple:" + (((gcalItem).calendarId || rawLabel || "default").toString()),
          roomLabel: rawLabel && !looksLikeUuid ? rawLabel : "Apple Calendar",
          roomType: "apple",
        };
      }

      return {
        roomId: "google:" + (((gcalItem).calendarId || rawLabel || "default").toString()),
        roomLabel: rawLabel && !looksLikeUuid ? rawLabel : "Google Calendar",
        roomType: "google",
      };
    },
    [groups]
  );`;

if (!content.includes(insertHelperAfter)) {
  console.log('Helper insertion point not found');
  process.exit(1);
}
content = content.replace(insertHelperAfter, helperBlock);

const oldEventLoop = `      filteredEvents.forEach((e) => {
        const startD = e.day;`;

const newEventLoop = `      filteredEvents.forEach((e) => {
        const roomMeta = getRoomMeta(e, "event");
        if (selectedRoomId && roomMeta.roomId !== selectedRoomId) return;

        const startD = e.day;`;

if (!content.includes(oldEventLoop)) {
  console.log('Event loop not found');
  process.exit(1);
}
content = content.replace(oldEventLoop, newEventLoop);

const oldTaskLoop = `      filteredTasks
        .filter(
          (t) =>
            t.scheduledDay === d &&
            t.scheduledMonth === m &&
            t.scheduledYear === y
        )
        .forEach((t) => {`;

const newTaskLoop = `      filteredTasks
        .filter(
          (t) =>
            t.scheduledDay === d &&
            t.scheduledMonth === m &&
            t.scheduledYear === y
        )
        .forEach((t) => {
          const roomMeta = getRoomMeta(t, "task");
          if (selectedRoomId && roomMeta.roomId !== selectedRoomId) return;`;

if (!content.includes(oldTaskLoop)) {
  console.log('Scheduled task loop not found');
  process.exit(1);
}
content = content.replace(oldTaskLoop, newTaskLoop);

const oldDueLoop = `      filteredTasks
        .filter((t) => {
          if (!t.dueDate) return false;`;

const newDueLoop = `      filteredTasks
        .filter((t) => {
          if (!t.dueDate) return false;`;

if (!content.includes(oldDueLoop)) {
  console.log('Due task loop start not found');
  process.exit(1);
}
content = content.replace(oldDueLoop, newDueLoop);

const oldDueForEach = `        .forEach((t) => {
          items.push({`;

const newDueForEach = `        .forEach((t) => {
          const roomMeta = getRoomMeta(t, "task");
          if (selectedRoomId && roomMeta.roomId !== selectedRoomId) return;

          items.push({`;

content = content.replace(oldDueForEach, newDueForEach);

const oldGoogleFilter = `      if (showGoogleCalendar) {
        googleCalendarEvents.forEach((ge) => {
          if (
            ge.isApple &&
            selectedAppleCalendars.length > 0 &&
            !selectedAppleCalendars.includes(
              (ge as any).calendarTitle || (ge as any).calendarId || "Apple"
            )
          ) {
            return;
          }`;

const newGoogleFilter = `      if (showGoogleCalendar) {
        googleCalendarEvents.forEach((ge) => {
          const roomMeta = getRoomMeta(ge, "gcal");
          if (selectedRoomId && roomMeta.roomId !== selectedRoomId) {
            return;
          }`;

if (!content.includes(oldGoogleFilter)) {
  console.log('Google/Apple filter block not found');
  process.exit(1);
}
content = content.replace(oldGoogleFilter, newGoogleFilter);

const oldDeps = `    [filteredEvents, filteredTasks, googleCalendarEvents, showGoogleCalendar, selectedAppleCalendars]
  );`;

const newDeps = `    [filteredEvents, filteredTasks, googleCalendarEvents, showGoogleCalendar, selectedRoomId, getRoomMeta]
  );`;

if (!content.includes(oldDeps)) {
  console.log('Dependency block not found');
  process.exit(1);
}
content = content.replace(oldDeps, newDeps);

const oldChipRow = `        <div className="flex gap-2 px-3 py-2 overflow-x-auto">
          <button
            onClick={() => setSelectedAppleCalendars([])}
            className={\`px-3 py-1 rounded-full text-sm whitespace-nowrap \${selectedAppleCalendars.length === 0
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
              className={\`px-3 py-1 rounded-full text-sm whitespace-nowrap \${selectedAppleCalendars.includes(cal)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }\`}
            >
              {cal}
            </button>
          ))}
        </div>`;

const newChipRow = `        <div className="flex gap-2 px-3 py-2 overflow-x-auto">
          <button
            onClick={() => setSelectedRoomId(null)}
            className={\`px-3 py-1 rounded-full text-sm whitespace-nowrap \${selectedRoomId === null
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
            }\`}
          >
            All
          </button>

          {roomList.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoomId(room.id)}
              className={\`px-3 py-1 rounded-full text-sm whitespace-nowrap flex items-center gap-1.5 \${selectedRoomId === room.id
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
              }\`}
            >
              <span>{room.label}</span>
            </button>
          ))}
        </div>`;

if (!content.includes(oldChipRow)) {
  console.log('Chip row block not found');
  process.exit(1);
}
content = content.replace(oldChipRow, newChipRow);

fs.writeFileSync(file, content);
console.log('Room filter refactor applied');
