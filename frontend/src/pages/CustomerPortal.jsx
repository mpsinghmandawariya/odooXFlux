export default function CustomerPortal({ user }) {
  return (
    <main className="dashboard-page customer-portal-page">
      <div className="page-heading">
        <div>
          <p className="page-eyebrow">CUSTOMER PORTAL</p>
          <h1>Welcome, {user.name}</h1>
          <p className="page-description">Your customer account is ready.</p>
        </div>
      </div>
      <section className="panel customer-portal-card">
        <span className="customer-portal-icon">✓</span>
        <h2>You’re all set</h2>
        <p>
          Your account is securely registered as a customer. Your subscriptions
          and invoices will appear here as they are added to the system.
        </p>
        <span className="customer-portal-email">{user.email}</span>
      </section>
    </main>
  );
}
