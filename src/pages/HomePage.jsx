import React from "react";
import {Link} from "react-router-dom"

function HomePage() {
  const trustedNames = ["fundis", "mamafua,", "plumbers", "jua Kali", "electrician", "cleaners", "movers" ]

  const renderTrustedNames = () =>
  trustedNames.map((name, index) => (
    <span key={index} className="trusted-name">
      {name}
    </span>
  ));
 return(
  <div className="home-page">
    <section className="hero-section">
      <div className="hero-text">
        <p className="hero-label">Your Trusted local HIring</p>
        <h1 className="hero-heading">Find Work <br /> Hire Someone <br /> You can trust</h1>
        <p className="hero-subtext">NeighborQuest connects skilled workers with people who need help,
            fast. Post a job or find your next gig in minutes.</p>
          <div className="hero-buttons">
             <Link to = "/register" className="btn-primary">Get Started</Link>
             <Link to = "/jobs" className="btn-secondary">Browse Jobs</Link>

          </div>
          <div className="her-stats">
            <div className="hero-stat-icon">✓</div>
            <p>Verified Workers &amp; Employers</p>
          </div>
      </div>
      <div className="hero-image-wrapper">
          <div className="hero-image-card">
            <div className="hero-badge">
              <span>New Job Posted</span>
              <p>Plumbing repair - Nairobi</p>
            </div>
          </div>
        </div>

    </section>
    <section className="trusted-section">
        <p className="trusted-label">Workers already hired through</p>
        <div className="trusted-logos">{renderTrustedNames()}</div>
      </section>

  </div>
 )
}

export default HomePage;