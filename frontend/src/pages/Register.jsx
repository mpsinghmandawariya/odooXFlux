import { useState } from "react";

const rules = [
  { label: "At least 9 characters", test: (value) => value.length > 8 },
  { label: "One uppercase letter", test: (value) => /[A-Z]/.test(value) },
  { label: "One lowercase letter", test: (value) => /[a-z]/.test(value) },
  {
    label: "One special character",
    test: (value) => /[^A-Za-z0-9]/.test(value),
  },
];

export default function Register({ onLogin, onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    if (!name.trim() || !email.trim() || !password || !confirm)
      return setMessage("Please complete all fields.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setMessage("Enter a valid email address.");
    if (!rules.every((rule) => rule.test(password)))
      return setMessage(
        "Your password does not meet all the requirements below.",
      );
    if (password !== confirm) return setMessage("The passwords do not match.");

    setIsSubmitting(true);
    try {
      await onRegister({ name: name.trim(), email: email.trim(), password });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-content register-content">
      <div className="mobile-brand">
        <span className="brand-mark">S</span> Subscript
        <span className="brand-accent">IQ</span>
      </div>
      <header className="auth-heading">
        <div className="auth-kicker">GET STARTED</div>
        <h2>Create your account</h2>
        <p>Set up your account to manage subscriptions in one place.</p>
      </header>
      <form className="auth-form" onSubmit={submit} noValidate>
        <label htmlFor="register-name">Full name</label>
        <div className="input-wrap">
          <span className="input-icon">♙</span>
          <input
            id="register-name"
            autoComplete="name"
            placeholder="Your full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <label htmlFor="register-email">Email address</label>
        <div className="input-wrap">
          <span className="input-icon">✉</span>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <label htmlFor="register-password">Password</label>
        <div className="input-wrap">
          <span className="input-icon">▣</span>
          <input
            id="register-password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a strong password"
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
        <div className="password-rules">
          {rules.map((rule) => (
            <span
              key={rule.label}
              className={rule.test(password) ? "rule passed" : "rule"}
            >
              <b>{rule.test(password) ? "✓" : "○"}</b>
              {rule.label}
            </span>
          ))}
        </div>
        <label htmlFor="register-confirm">Confirm password</label>
        <div className="input-wrap">
          <span className="input-icon">▣</span>
          <input
            id="register-confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
          />
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
          {isSubmitting ? "Creating account…" : "Create account"} <span>→</span>
        </button>
      </form>
      <p className="terms-copy">
        By creating an account, you agree to your organisation's applicable
        terms and policies.
      </p>
      <p className="switch-copy">
        Already have an account?{" "}
        <button type="button" className="text-button strong" onClick={onLogin}>
          Sign in
        </button>
      </p>
    </div>
  );
}
