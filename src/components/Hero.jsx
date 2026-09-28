import React from 'react';

export default function Hero() {
  return (
    <section id="home" className="py-5 bg-white border-bottom position-relative">
      <div className="container py-lg-4">
        <div className="row align-items-center g-5">
          {/* Left Column: Hiring Details & CTA */}
          <div className="col-lg-6">
            <div className="pe-lg-4">
              {/* Eyebrow Badge */}
              <div className="mb-3">
                <span className="hiring-badge">
                  <span className="hiring-dot"></span>
                  WE ARE HIRING
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="display-4 fw-bold text-mafoi-dark mb-3" style={{ lineHeight: 1.15 }}>
                Project Executive
              </h1>

              {/* Supporting Text */}
              <p className="lead-text mb-4">
                Join The Ma Foi Foundation and be part of meaningful projects that create opportunities and impact communities.
              </p>

              {/* Key Role Quick Info Pills */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                <span className="badge bg-light text-dark border px-3 py-2 fw-medium rounded-pill d-inline-flex align-items-center gap-1">
                  <i className="bi bi-geo-alt-fill text-mafoi-primary"></i> Chennai, Tamil Nadu
                </span>
                <span className="badge bg-light text-dark border px-3 py-2 fw-medium rounded-pill d-inline-flex align-items-center gap-1">
                  <i className="bi bi-briefcase-fill text-mafoi-primary"></i> Full-Time
                </span>
                <span className="badge bg-light text-dark border px-3 py-2 fw-medium rounded-pill d-inline-flex align-items-center gap-1">
                  <i className="bi bi-people-fill text-mafoi-primary"></i> Community Development
                </span>
              </div>

              {/* Prominent CTA Button */}
              <div className="d-flex flex-column flex-sm-row gap-3">
                <a
                  href="#apply-section"
                  className="btn btn-primary btn-lg px-4 py-3 rounded-pill fw-semibold shadow-sm d-inline-flex align-items-center justify-content-center gap-2"
                >
                  <span>Apply Now</span>
                  <i className="bi bi-arrow-down-short fs-4"></i>
                </a>
                <a
                  href="#about-role"
                  className="btn btn-outline-primary btn-lg px-4 py-3 rounded-pill fw-semibold d-inline-flex align-items-center justify-content-center gap-2"
                >
                  <span>Explore Role Details</span>
                </a>
              </div>

              {/* Trust Signal */}
              <div className="mt-4 pt-2 text-muted small d-flex align-items-center gap-2">
                <i className="bi bi-shield-check text-success fs-5"></i>
                <span>Direct recruitment by The Ma Foi Foundation. No recruitment fees involved.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Professional Corporate Image */}
          <div className="col-lg-6">
            <div className="hero-image-wrapper text-center">
              <img
                src="/images/project-executive-hiring.jpg"
                alt="The Ma Foi Foundation Project Executive team collaborating on social impact and community development initiatives"
                className="hero-image img-fluid"
                loading="eager"
              />
              {/* Subtle Corporate Highlight Badge */}
              <div className="hero-stat-badge d-none d-sm-flex align-items-center gap-3 text-start">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white"
                  style={{ width: '44px', height: '44px', backgroundColor: 'var(--mafoi-primary)' }}
                >
                  <i className="bi bi-award-fill fs-5"></i>
                </div>
                <div>
                  <div className="fw-bold text-mafoi-dark" style={{ fontSize: '0.95rem' }}>
                    Social Transformation
                  </div>
                  <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                    Empowering communities across India
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
