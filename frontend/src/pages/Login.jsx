import { useState } from "react";

export default function Login({ onRegister, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    if (!email.trim() || !password)
      return setMessage("Enter your email and password to continue.");

    setIsSubmitting(true);
    try {
      await onLogin({ email: email.trim(), password });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-content">
      <div className="mobile-brand">
        <span className="brand-mark">S</span> Subscript
        <span className="brand-accent">IQ</span>
      </div>
      <header className="auth-heading">
        <div className="auth-kicker">WELCOME BACK</div>
        <h2>Sign in to your account</h2>
        <p>Enter your details to access your workspace.</p>
      </header>
      <form className="auth-form" onSubmit={submit} noValidate>
        <label htmlFor="login-email">Email address</label>
        <div className="input-wrap">
          <span className="input-icon">✉</span>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="label-row">
          <label htmlFor="login-password">Password</label>
          <span
            className="text-button"
            title="Contact your administrator to reset your password"
          >
            Forgot password?
          </span>
        </div>
        <div className="input-wrap">
          <span className="input-icon">▣</span>
          <input
            id="login-password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            type="button"
            className="show-password"
            onClick={() => setShow((visible) => !visible)}
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
        {message && (
          <div className="form-message" role="alert">
            {message}
          </div>
        )}
        <button
          className="primary-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Sign in"} <span>→</span>
        </button>
      </form>
      <div className="auth-divider">
        <span>SECURE WORKSPACE ACCESS</span>
      </div>
      <p className="switch-copy">
        New to SubscriptIQ?{" "}
        <button
          type="button"
          className="text-button strong"
          onClick={onRegister}
        >
          Create an account
        </button>
      </p>
      <div className="security-note">
        <span className="shield">✓</span>
        <span>
          <strong>Your workspace, protected</strong>
          <small>Access is based on your assigned role and permissions.</small>
        </span>
      </div>
    </div>
  );
}
