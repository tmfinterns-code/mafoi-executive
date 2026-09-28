import React, { useState } from 'react';

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false);

  const toggleNav = () => setNavOpen(!navOpen);
  const closeNav = () => setNavOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom py-2 shadow-sm" aria-label="Main Navigation">
      <div className="container">
        {/* Brand */}
        <a className="navbar-brand d-flex align-items-center gap-2 text-decoration-none" href="#home" onClick={closeNav}>
          <div
            className="d-flex align-items-center justify-content-center text-white fw-bold rounded-3 shadow-sm"
            style={{ width: '42px', height: '42px', backgroundColor: 'var(--mafoi-dark)' }}
          >
            <i className="bi bi-building-check fs-4"></i>
          </div>
          <div>
            <div className="fw-bold fs-5 mb-0 lh-1 text-mafoi-dark" style={{ letterSpacing: '-0.3px' }}>
              The Ma Foi Foundation
            </div>
            <small className="text-mafoi-muted d-block" style={{ fontSize: '0.72rem', letterSpacing: '0.2px' }}>
              Creating opportunities. Building futures.
            </small>
          </div>
        </a>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={toggleNav}
          aria-controls="navbarNav"
          aria-expanded={navOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1 my-3 my-lg-0">
            <li className="nav-item">
              <a className="nav-link px-3 fw-medium text-secondary" href="#home" onClick={closeNav}>
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-3 fw-medium text-secondary" href="#about-role" onClick={closeNav}>
                About the Role
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link px-3 fw-medium text-secondary" href="#why-join" onClick={closeNav}>
                Why Join Us
              </a>
            </li>
            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <a
                className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
                href="#apply-section"
                onClick={closeNav}
              >
                <span>Apply Now</span>
                <i className="bi bi-arrow-right-short fs-5"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
