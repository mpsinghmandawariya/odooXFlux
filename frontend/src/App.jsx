import { useState } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import AppLayout from "./AppLayout";
import SectionPlaceholder from "./components/SectionPlaceholder";
import CustomerPortal from "./pages/CustomerPortal";
import Customers from "./pages/Customers";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Login from "./pages/Login";
import Plans from "./pages/Plans";
import Products from "./pages/Products";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Subscriptions from "./pages/Subscriptions";
import "./styles/auth.css";

function AuthPage() {
  const [form, setForm] = useState("login");
  const { user, isLoading, signIn, register } = useAuth();
  const navigate = useNavigate();

  async function handleSignIn(credentials) {
    await signIn(credentials);
    navigate("/", { replace: true });
  }

  async function handleRegister(details) {
    await register(details);
    navigate("/", { replace: true });
  }

  if (isLoading)
    return (
      <div className="auth-loading" role="status">
        Restoring your session…
      </div>
    );
  if (user) return <Navigate to="/" replace />;

  return (
    <main className="auth-app">
      <section className="auth-visual">
        <div className="brand">
          <span className="brand-mark">S</span>
          <span>
            Subscript<span className="brand-accent">IQ</span>
          </span>
        </div>
        <div className="visual-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> SUBSCRIPTION OPERATIONS, SIMPLIFIED
          </div>
          <h1>
            Everything recurring.
            <br />
            <span>One clear view.</span>
          </h1>
          <p>
            Manage plans, subscriptions, invoices and payments in one connected
            workspace.
          </p>
          <div className="visual-dashboard">
            <div className="preview-top">
              <strong>● Revenue overview</strong>
              <span className="preview-period">Last 30 days⌄</span>
            </div>
            <div className="preview-value">
              $48,294 <span>↗ 12.8%</span>
            </div>
            <div className="chart">
              <div className="chart-grid" />
              <svg
                viewBox="0 0 440 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0,82 C30,78 38,55 70,64 S110,73 142,48 S185,67 215,48 S258,60 292,35 S332,51 362,24 S405,34 440,8"
                  fill="none"
                  stroke="#86517f"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="preview-bottom">
              <div>
                <b className="mini-icon purple">↻</b>
                <span>
                  <small>Active subscriptions</small>
                  <strong>1,284</strong>
                </span>
              </div>
              <div>
                <b className="mini-icon green">$</b>
                <span>
                  <small>Monthly revenue</small>
                  <strong>$48,294</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="visual-footer">
          ● Built for clear, confident billing <span>•</span> Secure access
        </div>
      </section>
      <section className="auth-panel">
        {form === "login" ? (
          <Login
            onRegister={() => setForm("register")}
            onLogin={handleSignIn}
          />
        ) : (
          <Register
            onLogin={() => setForm("login")}
            onRegister={handleRegister}
          />
        )}
        <div className="panel-footer">
          © 2026 SubscriptIQ <span>Privacy</span>
          <span>Support</span>
        </div>
      </section>
    </main>
  );
}

function ProtectedPage({ children, roles = ["admin", "staff", "customer"] }) {
  const { user, isLoading, signOut } = useAuth();
  if (isLoading)
    return (
      <div className="auth-loading" role="status">
        Restoring your session…
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return (
    <AppLayout user={user} onLogout={signOut}>
      {children}
    </AppLayout>
  );
}

function WorkspaceHome() {
  const { user } = useAuth();
  return user.role === "customer" ? (
    <CustomerPortal user={user} />
  ) : (
    <Dashboard />
  );
}

function NotFound() {
  return (
    <div className="not-found">
      <h2>Page not found</h2>
      <Link to="/">Return to dashboard</Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <ProtectedPage>
                <WorkspaceHome />
              </ProtectedPage>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedPage roles={["admin"]}>
                <Products />
              </ProtectedPage>
            }
          />
          <Route
            path="/plans"
            element={
              <ProtectedPage roles={["admin"]}>
                <Plans />
              </ProtectedPage>
            }
          />
          <Route
            path="/subscriptions"
            element={
              <ProtectedPage roles={["admin", "staff"]}>
                <Subscriptions />
              </ProtectedPage>
            }
          />
          <Route
            path="/invoices"
            element={
              <ProtectedPage roles={["admin", "staff"]}>
                <Invoices />
              </ProtectedPage>
            }
          />
          <Route
            path="/renewals"
            element={
              <ProtectedPage roles={["admin", "staff"]}>
                <SectionPlaceholder
                  title="Renewals"
                  description="Review subscriptions approaching their next renewal date."
                  phase="6"
                />
              </ProtectedPage>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedPage roles={["admin", "staff"]}>
                <Customers />
              </ProtectedPage>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedPage roles={["admin", "staff"]}>
                <Reports />
              </ProtectedPage>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedPage roles={["admin"]}>
                <Settings />
              </ProtectedPage>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
