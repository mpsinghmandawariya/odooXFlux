import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import "./styles/app-shell.css";

export default function AppLayout({ children, user, onLogout }) {
  return (
    <div className="app-shell">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="app-main">
        <Header user={user} />
        {children}
      </div>
    </div>
  );
}
