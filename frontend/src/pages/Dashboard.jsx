import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

const subscriptions = [
  {
    customer: "Northstar Studio",
    initials: "NS",
    email: "billing@northstar.io",
    plan: "Business Annual",
    amount: "$249.00",
    status: "Active",
    created: "Oct 28, 2026",
  },
  {
    customer: "Acme Retail Co.",
    initials: "AR",
    email: "finance@acmeretail.com",
    plan: "Growth Monthly",
    amount: "$89.00",
    status: "Active",
    created: "Oct 27, 2026",
  },
  {
    customer: "Vertex Systems",
    initials: "VS",
    email: "accounts@vertex.dev",
    plan: "Enterprise Annual",
    amount: "$599.00",
    status: "Trial",
    created: "Oct 26, 2026",
  },
  {
    customer: "Juniper & Co.",
    initials: "JC",
    email: "hello@juniper.co",
    plan: "Starter Monthly",
    amount: "$29.00",
    status: "Past due",
    created: "Oct 25, 2026",
  },
  {
    customer: "Mosaic Digital",
    initials: "MD",
    email: "team@mosaic.digital",
    plan: "Business Monthly",
    amount: "$129.00",
    status: "Active",
    created: "Oct 24, 2026",
  },
];

const renewals = [
  {
    name: "Northstar Studio",
    plan: "Business Annual",
    date: "Nov 02, 2026",
    amount: "$2,988.00",
    initials: "NS",
    color: "lavender",
  },
  {
    name: "Acme Retail Co.",
    plan: "Growth Monthly",
    date: "Nov 04, 2026",
    amount: "$89.00",
    initials: "AR",
    color: "peach",
  },
  {
    name: "Mosaic Digital",
    plan: "Business Monthly",
    date: "Nov 06, 2026",
    amount: "$129.00",
    initials: "MD",
    color: "mint",
  },
];

const plans = [
  { label: "Business", count: 482, color: "plan-business" },
  { label: "Growth", count: 356, color: "plan-growth" },
  { label: "Starter", count: 291, color: "plan-starter" },
  { label: "Enterprise", count: 155, color: "plan-enterprise" },
];

const metrics = [
  {
    label: "Monthly recurring revenue",
    value: "$48,294",
    change: "+12.8%",
    icon: "$",
    tone: "purple",
    note: "vs. last month",
  },
  {
    label: "Active subscriptions",
    value: "1,284",
    change: "+8.2%",
    icon: "↻",
    tone: "blue",
    note: "vs. last month",
  },
  {
    label: "Total customers",
    value: "986",
    change: "+5.4%",
    icon: "♧",
    tone: "green",
    note: "vs. last month",
  },
  {
    label: "Churn rate",
    value: "2.4%",
    change: "−0.6%",
    icon: "⌁",
    tone: "orange",
    note: "vs. last month",
  },
];

const revenuePoints =
  "0,130 72,115 144,123 216,85 288,99 360,62 432,75 504,42 576,50 648,18";

function MetricCard({ metric }) {
  return (
    <article className="metric-card">
      <div className={`metric-icon ${metric.tone}`}>{metric.icon}</div>
      <p>{metric.label}</p>
      <div className="metric-card-bottom">
        <strong>{metric.value}</strong>
        <span className="metric-change">{metric.change}</span>
      </div>
      <small className="metric-note">{metric.note}</small>
    </article>
  );
}

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const filteredSubscriptions = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return subscriptions;
    return subscriptions.filter((item) =>
      [item.customer, item.email, item.plan, item.status].some((value) =>
        value.toLowerCase().includes(search),
      ),
    );
  }, [query]);

  return (
    <main className="dashboard-page">
      <div className="page-heading">
        <div>
          <p className="page-eyebrow">MONDAY, OCTOBER 31, 2026</p>
          <h1>Overview</h1>
          <p className="page-description">
            Here’s what’s happening with your subscriptions today.
          </p>
        </div>
        <button className="date-filter" type="button">
          <span>▦</span> This month <span className="chevron">⌄</span>
        </button>
      </div>

      <section
        className="metric-grid"
        aria-label="Subscription business summary"
      >
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="dashboard-panels">
        <article className="panel revenue-panel">
          <div className="panel-heading">
            <div>
              <h2>Revenue overview</h2>
              <p>Monthly recurring revenue over the last 10 months</p>
            </div>
            <button className="chart-select" type="button">
              Monthly <span>⌄</span>
            </button>
          </div>
          <div className="revenue-total">
            $48,294 <span className="metric-change">↗ 12.8%</span>
          </div>
          <div
            className="revenue-chart"
            role="img"
            aria-label="Illustrative monthly revenue trend, increasing across ten months"
          >
            <div className="chart-y-labels">
              <span>$50k</span>
              <span>$40k</span>
              <span>$30k</span>
              <span>$20k</span>
              <span>$10k</span>
              <span>$0</span>
            </div>
            <div className="chart-plot">
              <div className="chart-gridlines">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <svg
                viewBox="0 0 648 160"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="revenueArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#805078" stopOpacity=".2" />
                    <stop offset="100%" stopColor="#805078" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon
                  points={`0,160 ${revenuePoints} 648,160`}
                  fill="url(#revenueArea)"
                />
                <polyline
                  points={revenuePoints}
                  fill="none"
                  stroke="#805078"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="chart-x-labels">
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                ].map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article className="panel distribution-panel">
          <div className="panel-heading">
            <div>
              <h2>Plan distribution</h2>
              <p>Active subscriptions by plan</p>
            </div>
            <button
              className="icon-button"
              type="button"
              aria-label="More plan distribution options"
            >
              ···
            </button>
          </div>
          <div className="distribution-total">
            <strong>1,284</strong>
            <span>subscriptions</span>
          </div>
          <div
            className="distribution-bar"
            aria-label="Distribution of subscriptions across four plans"
          >
            <span className="plan-business" />
            <span className="plan-growth" />
            <span className="plan-starter" />
            <span className="plan-enterprise" />
          </div>
          <div className="plan-legend">
            {plans.map((plan) => (
              <div key={plan.label}>
                <i className={plan.color} />
                <span>{plan.label}</span>
                <strong>{plan.count}</strong>
                <small>{Math.round((plan.count / 1284) * 100)}%</small>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="activity-grid">
        <article className="panel subscriptions-panel">
          <div className="panel-heading subscriptions-heading">
            <div>
              <h2>Recent subscriptions</h2>
              <p>A snapshot of your latest customer activity</p>
            </div>
            <Link to="/subscriptions" className="view-all-link">
              View all <span>→</span>
            </Link>
          </div>
          <label className="subscription-search">
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Search customers, plans..."
              aria-label="Search sample subscriptions"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>
          <div className="subscription-table-wrap">
            <table className="subscription-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map((item) => (
                  <tr key={item.email}>
                    <td>
                      <span className="customer-cell">
                        <i>{item.initials}</i>
                        <span>
                          <strong>{item.customer}</strong>
                          <small>{item.email}</small>
                        </span>
                      </span>
                    </td>
                    <td>{item.plan}</td>
                    <td className="invoice-amount">
                      {item.amount}
                      <small className="amount-period"> / month</small>
                    </td>
                    <td>
                      <span
                        className={`subscription-status ${item.status.toLowerCase().replace(" ", "-")}`}
                      >
                        <i />
                        {item.status}
                      </span>
                    </td>
                    <td>{item.created}</td>
                  </tr>
                ))}
                {filteredSubscriptions.length === 0 && (
                  <tr>
                    <td className="empty-results" colSpan="5">
                      No sample subscriptions match “{query}”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel renewals-panel">
          <div className="panel-heading">
            <div>
              <h2>Upcoming renewals</h2>
              <p>Subscriptions renewing soon</p>
            </div>
            <Link to="/renewals" className="view-all-link">
              View all <span>→</span>
            </Link>
          </div>
          <div className="renewal-list">
            {renewals.map((renewal) => (
              <div className="renewal-item" key={renewal.name}>
                <span className={`renewal-avatar ${renewal.color}`}>
                  {renewal.initials}
                </span>
                <span className="renewal-details">
                  <strong>{renewal.name}</strong>
                  <small>{renewal.plan}</small>
                  <small className="renewal-date">↻ {renewal.date}</small>
                </span>
                <strong className="renewal-amount">{renewal.amount}</strong>
              </div>
            ))}
          </div>
          <Link to="/renewals" className="renewal-calendar-link">
            See renewal calendar <span>→</span>
          </Link>
        </article>
      </section>

      <footer className="dashboard-footer">
        <span>Illustrative dashboard data · Brightloop Software</span>
        <span>Phase 1 prototype</span>
      </footer>
    </main>
  );
}
