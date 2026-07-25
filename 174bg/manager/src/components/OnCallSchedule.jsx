import { useMemo, useState } from "react";
import { pb } from "../lib/pocketbase";
import {
  DAYS_OF_WEEK,
  formatUtcOffset,
  getLocalOnCallSchedule,
  listTimeZones,
  localScheduleToUtc,
} from "../lib/oncallTime";

export default function OnCallSchedule({ record, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [timeZone, setTimeZone] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ text: "", error: false });

  const display = useMemo(() => getLocalOnCallSchedule(record), [record]);
  const zones = useMemo(() => listTimeZones(), []);

  function startEdit() {
    const { timeZone: tz, schedule: sched } = getLocalOnCallSchedule(record);
    setTimeZone(tz);
    setSchedule(sched);
    setEditing(true);
    setStatus({ text: "", error: false });
  }

  function cancelEdit() {
    setEditing(false);
  }

  function toggleDay(day, available) {
    setSchedule((prev) => {
      const next = { ...prev };
      if (available) {
        next[day] = {
          available: true,
          start: prev[day]?.start ?? "",
          end: prev[day]?.end ?? "",
        };
      } else {
        delete next[day];
      }
      return next;
    });
  }

  function setDayTime(day, key, value) {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [key]: value },
    }));
  }

  async function save() {
    setSaving(true);
    try {
      const utcSchedule = localScheduleToUtc(schedule, timeZone);
      const payload = { timezone: timeZone, ...utcSchedule };
      const updated = await pb.collection("members").update(record.id, {
        onCallSchedule: payload,
      });
      onUpdate(updated);
      setEditing(false);
      setStatus({ text: "", error: false });
    } catch (err) {
      const msg = err?.response
        ? JSON.stringify(err.response)
        : (err?.message ?? String(err));
      setStatus({ text: `Save failed: ${msg}`, error: true });
    } finally {
      setSaving(false);
    }
  }

  const shownTz = editing ? timeZone : display.timeZone;
  const shownSchedule = editing ? schedule : display.schedule;
  const tzOptions = zones.includes(shownTz) ? zones : [shownTz, ...zones];

  return (
    <div id="oncall">
      <div>
        <b>On-Call Schedule</b>{" "}
        {!editing && (
          <button type="button" onClick={startEdit}>
            ✏️ Edit
          </button>
        )}
        {editing && (
          <>
            <button type="button" disabled={saving} onClick={save}>
              💾 Save
            </button>{" "}
            <button type="button" disabled={saving} onClick={cancelEdit}>
              ❌ Cancel
            </button>
          </>
        )}
      </div>
      <p style={{ margin: "0.25rem 0 0.75rem", fontSize: "0.85rem", color: "var(--text-dim)" }}>
        Let the group know which days and hours you're usually free to join operations.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <b>Timezone:</b>
        {editing ? (
          <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
            {tzOptions.map((tz) => (
              <option key={tz} value={tz}>
                {tz} ({formatUtcOffset(tz)})
              </option>
            ))}
          </select>
        ) : (
          <span>
            {shownTz} ({formatUtcOffset(shownTz)})
          </span>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Free</th>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>
          {DAYS_OF_WEEK.map((day) => {
            const entry = shownSchedule[day] ?? {};
            return (
              <tr key={day}>
                <td>{day}</td>
                <td>
                  {editing ? (
                    <input
                      type="checkbox"
                      checked={!!entry.available}
                      onChange={(e) => toggleDay(day, e.target.checked)}
                    />
                  ) : entry.available ? (
                    "✅"
                  ) : (
                    "❌"
                  )}
                </td>
                <td>
                  {editing ? (
                    <input
                      type="time"
                      value={entry.start ?? ""}
                      disabled={!entry.available}
                      onChange={(e) => setDayTime(day, "start", e.target.value)}
                    />
                  ) : entry.available && entry.start ? (
                    entry.start
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  {editing ? (
                    <input
                      type="time"
                      value={entry.end ?? ""}
                      disabled={!entry.available}
                      onChange={(e) => setDayTime(day, "end", e.target.value)}
                    />
                  ) : entry.available && entry.end ? (
                    entry.end
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: status.error ? "red" : "" }}>
        {status.text}
      </p>
    </div>
  );
}
