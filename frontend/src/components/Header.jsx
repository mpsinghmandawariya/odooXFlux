export default function Header({ user }) {
  return (
    <header className="header">
      <div className="header-breadcrumb">
        <span>Brightloop Software</span>
        <span>/</span>
        <strong>Overview</strong>
      </div>
      <div className="header-actions">
        <label className="header-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search anything..."
            aria-label="Search"
          />
          <kbd>⌘ K</kbd>
        </label>
        <button
          className="header-icon-button"
          type="button"
          aria-label="Notifications"
        >
          <span>♧</span>
          <i />
        </button>
        <button
          className="header-user"
          type="button"
          aria-label={`${user?.name || "Account"}, ${user?.role || "customer"}`}
        >
          <span className="header-avatar">
            {user?.name?.slice(0, 2).toUpperCase() || "U"}
          </span>
          <span className="header-user-name">{user?.name || "Account"}</span>
          <span className="header-chevron">⌄</span>
        </button>
      </div>
    </header>
  );
}
