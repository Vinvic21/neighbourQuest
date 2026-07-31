import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/images/hero-workers.jpg";


const HomePage = () => {
  const trustedCategories = [
    "fundis",
    "mamafua",
    "plumbers",
    "jua kali",
    "electrician",
    "cleaners",
    "movers",
  ];

  const renderTrustedCategories = () => {
    return trustedCategories.map((category, index) => (
      <span key={index} className="trusted-category">
        {category}
      </span>
    ));
  };

  return (
    <div className="home-page">
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay">
          <div className="hero-text">
            <p className="hero-label">Your Trusted Local Hiring</p>
            <h1 className="hero-heading">
              Find Work
              <br />
              Hire Someone
              <br />
              You Can Trust
            </h1>
            <p className="hero-subtext">
              NeighborQuest connects skilled workers with people who need
              help, fast. Post a job or find your next gig in minutes.
            </p>

            <div className="hero-buttons">
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
              <Link to="/jobs" className="btn-secondary">
                Browse Jobs
              </Link>
            </div>

            <div className="hero-stat">
              <div className="hero-stat-icon">✓</div>
              <p>Verified Workers &amp; Employers</p>
            </div>
          </div>

          <div className="hero-badge">
            <span>New Job Posted</span>
            <p>Plumbing repair - Nairobi</p>
          </div>
        </div>
      </section>

      <section className="trusted-section">
        <p className="trusted-label">Workers already hired through</p>
        <div className="trusted-logos">{renderTrustedCategories()}</div>
      </section>
    </div>
  );
};

export default HomePage;