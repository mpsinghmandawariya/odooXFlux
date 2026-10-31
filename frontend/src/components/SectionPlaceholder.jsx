export default function SectionPlaceholder({ title, description, phase }) {
  return (
    <main className="section-page">
      <div className="page-eyebrow">BRIGHTLOOP WORKSPACE</div>
      <h1>{title}</h1>
      <p>{description}</p>
      <section className="section-empty-state">
        <span className="empty-state-icon">◇</span>
        <h2>{title} management</h2>
        <p>
          This area is ready for Phase {phase}. The navigation and application
          shell are in place.
        </p>
        <span className="coming-soon-badge">COMING IN PHASE {phase}</span>
      </section>
    </main>
  );
}
