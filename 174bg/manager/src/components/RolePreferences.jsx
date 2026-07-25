import { Fragment, useState } from "react";
import { pb } from "../lib/pocketbase";
import { ROLES } from "../lib/roles";
import { getOtherJsonData } from "../lib/otherJsonData";

export default function RolePreferences({ record, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState([]);
  const [favourite, setFavourite] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ text: "", error: false });

  const savedPrefs = record?.RolePreferencesSelect ?? [];
  const savedFavourite = getOtherJsonData(record).FavouriteRole ?? null;

  function startEdit() {
    setSelected(savedPrefs);
    setFavourite(savedFavourite);
    setEditing(true);
    setStatus({ text: "", error: false });
  }

  function cancelEdit() {
    setEditing(false);
  }

  function toggleRole(value) {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value],
    );
  }

  function toggleFavourite(value) {
    setFavourite((prev) => (prev === value ? null : value));
  }

  async function save() {
    setSaving(true);
    try {
      const fav = favourite && selected.includes(favourite) ? favourite : null;
      const other = getOtherJsonData(record);
      if (fav) other.FavouriteRole = fav;
      else delete other.FavouriteRole;

      const updated = await pb.collection("members").update(record.id, {
        RolePreferencesSelect: selected,
        OtherJsonData: other,
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

  const displayPrefs = editing ? selected : savedPrefs;
  const displayFavourite = editing ? favourite : savedFavourite;

  let lastBranch = null;

  return (
    <div id="preferences">
      <div>
        <b>Role Preferences</b>{" "}
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
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>✅</th>
            <th>⭐</th>
          </tr>
        </thead>
        <tbody>
          {ROLES.map((role) => {
            const branchHeader = role.branch !== lastBranch;
            lastBranch = role.branch;
            return (
              <Fragment key={role.value}>
                {branchHeader && (
                  <tr data-separator="true">
                    <td
                      colSpan={3}
                      style={{
                        fontWeight: 600,
                        paddingTop: "0.75rem",
                        paddingBottom: "0.25rem",
                        borderBottom: "none",
                        opacity: 0.6,
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {role.branch ?? ""}
                    </td>
                  </tr>
                )}
                <tr>
                  <td>
                    {role.link ? (
                      <a href={role.link} target="_blank" rel="noopener noreferrer">
                        {role.text}
                      </a>
                    ) : (
                      role.text
                    )}
                  </td>
                  <td>
                    {editing ? (
                      <input
                        type="checkbox"
                        checked={selected.includes(role.value)}
                        onChange={() => toggleRole(role.value)}
                      />
                    ) : displayPrefs.includes(role.value) ? (
                      "✅"
                    ) : (
                      "❌"
                    )}
                  </td>
                  <td>
                    {editing ? (
                      <input
                        type="radio"
                        name="favourite-role"
                        checked={favourite === role.value}
                        onChange={() => {}}
                        onClick={() => toggleFavourite(role.value)}
                      />
                    ) : displayFavourite === role.value ? (
                      "⭐"
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
      <p style={{ margin: 0, fontSize: "0.85rem", color: status.error ? "red" : "" }}>
        {status.text}
      </p>
    </div>
  );
}
