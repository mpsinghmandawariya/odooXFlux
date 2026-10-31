import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const navigation = [
  { label: "Overview", path: "/", icon: "▦" },
  { label: "Subscriptions", path: "/subscriptions", icon: "↻" },
  { label: "Products & Plans", path: "/products", icon: "◈" },
  { label: "Customers", path: "/customers", icon: "♧" },
  { label: "Invoices", path: "/invoices", icon: "▤" },
  { label: "Renewals", path: "/renewals", icon: "⟳" },
];

export default function Sidebar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const visibleNavigation =
    user?.role === "admin"
      ? navigation
      : user?.role === "staff"
        ? navigation.filter((item) => item.path !== "/products")
        : navigation.filter((item) => item.path === "/");

  function logout() {
    onLogout();
    setMenuOpen(false);
    navigate("/login", { replace: true });
  }

  return (
    <aside className={`sidebar${menuOpen ? " menu-open" : ""}`}>
      <div className="sidebar-topline">
        <a className="sidebar-brand" href="/" aria-label="SubscriptIQ home">
          <span className="sidebar-brand-mark">S</span>
          <span>
            Subscript<span>IQ</span>
          </span>
        </a>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "×" : "☰"}</span>
        </button>
      </div>
      <div className="workspace-switcher">
        <span className="workspace-avatar">B</span>
        <span>
          <strong>Brightloop Software</strong>
          <small>Workspace</small>
        </span>
        <i>⌄</i>
      </div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        <p className="nav-caption">WORKSPACE</p>
        {visibleNavigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <span className="nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
            {item.label === "Invoices" && <span className="nav-badge">12</span>}
          </NavLink>
        ))}
        {user?.role !== "customer" && (
          <a
            className="nav-link"
            href="mailto:support@brightloop.example"
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-icon" aria-hidden="true">
              ?
            </span>
            <span>Help &amp; Support</span>
          </a>
        )}
      </nav>
      <div className="sidebar-bottom">
        {user?.role === "admin" && (
          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-icon">⚙</span>
            <span>Settings</span>
          </NavLink>
        )}
        <div className="sidebar-help">
          <span className="help-mark">?</span>
          <strong>Need a hand?</strong>
          <small>Visit our help center</small>
          <a href="mailto:support@brightloop.example">
            Get support <span>→</span>
          </a>
        </div>
        <button
          type="button"
          className="profile-link"
          onClick={logout}
          title="Log out"
        >
          <span className="profile-avatar">
            {user?.name?.slice(0, 2).toUpperCase() || "U"}
          </span>
          <span>
            <strong>{user?.name || "Account"}</strong>
            <small>{user?.role || "customer"} · Log out</small>
          </span>
          <span className="profile-more">···</span>
        </button>
      </div>
    </aside>
  );
}
