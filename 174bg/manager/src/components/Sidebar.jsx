import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Overview", end: true },
  { to: "/preferences", label: "Role Preferences" },
  { to: "/oncall", label: "On-Call Schedule" },
  { to: "/ledger", label: "Ledger" },
];

export default function Sidebar({ record, open, onClose, onLogout }) {
  const name = record?.RSI_Handle || record?.name || "Pilot";

  return (
    <>
      {open && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside className={`sidebar${open ? " sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">174BG Manager</span>
          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>
        <p className="sidebar-user">{name}</p>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                "sidebar-link" + (isActive ? " sidebar-link-active" : "")
              }
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="sidebar-logout" onClick={onLogout}>
          Logout
        </button>
      </aside>
    </>
  );
}
