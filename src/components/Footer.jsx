import React from 'react';

export default function Footer({ onOpenAdmin }) {
  return (
    <footer className="bg-mafoi-dark text-white pt-5 pb-4">
      <div className="container">
        <div className="row g-4 justify-content-between pb-4 border-bottom border-secondary border-opacity-25">
          {/* Organization Details */}
          <div className="col-lg-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center bg-white text-mafoi-dark fw-bold rounded-3"
                style={{ width: '40px', height: '40px' }}
              >
                <i className="bi bi-building-check fs-5"></i>
              </div>
              <div>
                <h5 className="text-white fw-bold mb-0">The Ma Foi Foundation</h5>
                <small className="text-white-50">Creating opportunities. Building futures.</small>
              </div>
            </div>
            <p className="text-white-50 small mb-3" style={{ maxWidth: '420px', lineHeight: 1.7 }}>
              The Ma Foi Foundation is dedicated to empowering marginalized communities, fostering educational excellence,
              supporting youth livelihoods, and driving grassroots sustainable change.
            </p>
            <div className="d-flex gap-3 text-white-50 fs-5">
              <a href="#home" className="text-white-50 text-decoration-none" aria-label="Social Link">
                <i className="bi bi-globe"></i>
              </a>
              <a href="#home" className="text-white-50 text-decoration-none" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#home" className="text-white-50 text-decoration-none" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="text-uppercase text-white fw-bold mb-3 small" style={{ letterSpacing: '0.05em' }}>
              Quick Links
            </h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li>
                <a href="#home" className="text-white-50 text-decoration-none hover-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#about-role" className="text-white-50 text-decoration-none hover-white">
                  About the Role
                </a>
              </li>
              <li>
                <a href="#why-join" className="text-white-50 text-decoration-none hover-white">
                  Why Join Us
                </a>
              </li>
              <li>
                <a href="#apply-section" className="text-white-50 text-decoration-none hover-white">
                  Apply Now
                </a>
              </li>
            </ul>
          </div>

          {/* Recruitment Advisory */}
          <div className="col-md-5 col-lg-4">
            <h6 className="text-uppercase text-white fw-bold mb-3 small" style={{ letterSpacing: '0.05em' }}>
              Recruitment Notice
            </h6>
            <p className="text-white-50 small mb-2" style={{ lineHeight: 1.6 }}>
              The Ma Foi Foundation follows a transparent, merit-based selection process and does not charge any fee at any
              stage of the recruitment cycle.
            </p>
            <div className="text-white-50 small">
              <i className="bi bi-envelope me-2"></i>
              <span>careers@themafoifoundation.org</span>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="row pt-4 align-items-center justify-content-between small text-white-50">
          <div className="col-md-5 text-center text-md-start mb-2 mb-md-0">
            © 2026 The Ma Foi Foundation. All rights reserved.
          </div>
          <div className="col-md-7 text-center text-md-end d-flex flex-wrap justify-content-center justify-content-md-end gap-3 align-items-center">
            <a href="#apply-section" className="text-white-50 text-decoration-none">
              Privacy Notice
            </a>
            <span>•</span>
            <a href="#about-role" className="text-white-50 text-decoration-none">
              Recruitment
            </a>
            <span>•</span>
            <a href="#home" className="text-white-50 text-decoration-none">
              Equal Opportunity
            </a>
            <span>•</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="btn btn-link text-white-50 p-0 text-decoration-none small d-inline-flex align-items-center gap-1 hover-white"
              title="Admin Portal (Shortcut: Ctrl + Shift + M)"
            >
              <i className="bi bi-shield-lock"></i>
              <span>Admin (Ctrl+Shift+M)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
