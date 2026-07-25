import { RANK_NAMES } from "../lib/roles";

const REQUIRED_INFO_FIELDS = [
  { field: "id", label: "174BG ID" },
  { field: "UEE_Citizen_Record_ID", label: "UEE Citizen Record ID" },
  { field: "RSI_Display_Name", label: "RSI Display Name" },
  { field: "RSI_Handle", label: "RSI Handle" },
  { field: "joined_rsi_org", label: "Joined RSI Organisation" },
  { field: "email", label: "Email" },
  { field: "Branch", label: "Branch" },
  { field: "Rank_Number", label: "Rank Number" },
];

export default function RequiredInfo({ record }) {
  let anyMissing = false;

  const rows = REQUIRED_INFO_FIELDS.map(({ field, label }) => {
    const value = record?.[field];
    // Treat only null/undefined/empty-string as missing so legitimately
    // falsy values (e.g. Rank_Number 0, joined_rsi_org false) still show.
    const missing = value == null || value === "";
    if (missing) anyMissing = true;
    return { field, label, value, missing };
  });

  const branch = record?.Branch;
  const rankNumber = record?.Rank_Number;
  const rankName = RANK_NAMES[branch]?.[rankNumber];
  if (!rankName) anyMissing = true;

  const staffRolesRaw = record?.StaffRoles;
  const staffList = Array.isArray(staffRolesRaw)
    ? staffRolesRaw
    : staffRolesRaw
      ? [staffRolesRaw]
      : [];

  return (
    <div id="required-info">
      <h2>Required Information</h2>
      {rows.map(({ field, label, value, missing }) => (
        <div key={field}>
          <b>{label}:</b>{" "}
          <span style={{ color: missing ? "red" : "" }}>
            {missing ? "MISSING" : value}
          </span>
        </div>
      ))}
      <div>
        <b>Rank Name:</b>{" "}
        <span style={{ color: rankName ? "" : "red" }}>
          {rankName ?? "MISSING"}
        </span>
      </div>
      <div>
        <b>Staff Roles:</b>{" "}
        <span>{staffList.length > 0 ? staffList.join(", ") : "none"}</span>
      </div>
      {anyMissing && (
        <div id="profile-warning">
          ⚠️ Your profile is incomplete. Message an officer ASAP!
        </div>
      )}
    </div>
  );
}
