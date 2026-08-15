export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Sunday-first, matching Date#getDay()/getUTCDay() and Intl's "weekday"
export const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const WEEKDAY_INDEX = Object.fromEntries(
  WEEKDAY_NAMES.map((d, i) => [d, i]),
);

export function pad2(n) {
  return String(n).padStart(2, "0");
}

export function getBrowserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export function listTimeZones() {
  if (typeof Intl.supportedValuesOf === "function") {
    try {
      return Intl.supportedValuesOf("timeZone");
    } catch {
      // fall through to the fallback list below
    }
  }
  return [
    "UTC",
    "America/Los_Angeles",
    "America/Denver",
    "America/Chicago",
    "America/New_York",
    "America/Sao_Paulo",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Moscow",
    "Africa/Johannesburg",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Shanghai",
    "Asia/Tokyo",
    "Australia/Sydney",
    "Pacific/Auckland",
  ];
}

// Offset (ms) of `timeZone` from UTC at the instant `date` represents.
export function tzOffsetMs(date, timeZone) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = {};
  for (const { type, value } of dtf.formatToParts(date)) {
    parts[type] = value;
  }
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    parts.hour === "24" ? 0 : Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return asUTC - date.getTime();
}

// Formats `timeZone`'s UTC offset at `date` as "UTC+HH:MM"/"UTC-HH:MM".
export function formatUtcOffset(timeZone, date = new Date()) {
  const totalMinutes = Math.round(tzOffsetMs(date, timeZone) / 60000);
  const sign = totalMinutes < 0 ? "-" : "+";
  const abs = Math.abs(totalMinutes);
  return `UTC${sign}${pad2(Math.floor(abs / 60))}:${pad2(abs % 60)}`;
}

// Nearest same-or-later calendar date whose local weekday in `timeZone`
// is `day` - used as a DST-correct anchor for the conversion below.
function nextLocalDateFor(day, timeZone) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  });
  const parts = {};
  for (const { type, value } of dtf.formatToParts(new Date())) {
    parts[type] = value;
  }
  const diff = (WEEKDAY_INDEX[day] - WEEKDAY_INDEX[parts.weekday] + 7) % 7;
  const base = new Date(
    Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)),
  );
  base.setUTCDate(base.getUTCDate() + diff);
  return base;
}

// Nearest same-or-later UTC calendar date whose UTC weekday is `day`.
function nextUtcDateFor(day) {
  const now = new Date();
  const diff = (WEEKDAY_INDEX[day] - now.getUTCDay() + 7) % 7;
  const base = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  base.setUTCDate(base.getUTCDate() + diff);
  return base;
}

// Converts a weekday + "HH:MM" wall-clock time in `timeZone` to the
// equivalent UTC weekday + "HH:MM" (the day may shift due to the offset).
export function localDayTimeToUtc(day, time, timeZone) {
  const [hour, minute] = time.split(":").map(Number);
  const base = nextLocalDateFor(day, timeZone);
  const guess = Date.UTC(
    base.getUTCFullYear(),
    base.getUTCMonth(),
    base.getUTCDate(),
    hour,
    minute,
  );
  const offset = tzOffsetMs(new Date(guess), timeZone);
  const actual = new Date(guess - offset);
  return {
    day: WEEKDAY_NAMES[actual.getUTCDay()],
    time: `${pad2(actual.getUTCHours())}:${pad2(actual.getUTCMinutes())}`,
  };
}

// Converts a UTC weekday + "HH:MM" back to weekday + "HH:MM" wall-clock
// time in `timeZone`.
export function utcDayTimeToLocal(day, time, timeZone) {
  const [hour, minute] = time.split(":").map(Number);
  const base = nextUtcDateFor(day);
  const instant = new Date(
    Date.UTC(
      base.getUTCFullYear(),
      base.getUTCMonth(),
      base.getUTCDate(),
      hour,
      minute,
    ),
  );
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = {};
  for (const { type, value } of dtf.formatToParts(instant)) {
    parts[type] = value;
  }
  return {
    day: parts.weekday,
    time: `${parts.hour === "24" ? "00" : parts.hour}:${parts.minute}`,
  };
}

export function getEffectiveTimezone(raw) {
  return raw.timezone || getBrowserTimeZone();
}

// Converts the stored UTC schedule to local wall-clock times, keyed by
// local weekday, for display/editing.
export function utcScheduleToLocal(raw, timeZone) {
  const local = {};
  for (const day of DAYS_OF_WEEK) {
    const entry = raw[day];
    if (!entry?.available) continue;
    const start = utcDayTimeToLocal(day, entry.start, timeZone);
    const end = utcDayTimeToLocal(day, entry.end, timeZone);
    local[start.day] = {
      available: true,
      start: start.time,
      end: end.time,
    };
  }
  return local;
}

// Converts a local-keyed schedule (from the edit form) to UTC for storage.
export function localScheduleToUtc(local, timeZone) {
  const utc = {};
  for (const day of DAYS_OF_WEEK) {
    const entry = local[day];
    if (!entry?.available) continue;
    const start = localDayTimeToUtc(day, entry.start || "00:00", timeZone);
    const end = localDayTimeToUtc(day, entry.end || "00:00", timeZone);
    utc[start.day] = { available: true, start: start.time, end: end.time };
  }
  return utc;
}

// onCallSchedule is stored as JSON, UTC-normalized:
// { timezone: "IANA/Zone", [utcDay]: { available, start, end } }
export function getOnCallRaw(record) {
  const raw = record?.onCallSchedule;
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) || {};
    } catch {
      return {};
    }
  }
  return { ...raw };
}

// Legacy records saved before timezone support has no `timezone` key - those
// values are already local wall-clock times, so skip conversion.
export function getLocalOnCallSchedule(record) {
  const raw = getOnCallRaw(record);
  const timeZone = getEffectiveTimezone(raw);
  const schedule = raw.timezone ? utcScheduleToLocal(raw, timeZone) : raw;
  return { timeZone, schedule };
}
