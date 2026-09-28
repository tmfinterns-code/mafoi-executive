import React from 'react';

export default function AboutRole() {
  const roleHighlights = [
    {
      icon: 'bi-diagram-3-fill',
      title: 'Project Coordination',
      description: 'Support planning, coordination and execution of project activities across target beneficiary locations.',
    },
    {
      icon: 'bi-file-earmark-bar-graph-fill',
      title: 'Documentation & MIS',
      description: 'Maintain project documentation, reports, records and MIS updates with high accuracy and timely submissions.',
    },
    {
      icon: 'bi-people-fill',
      title: 'Stakeholder Management',
      description: 'Coordinate with internal teams, partners, institutions and other stakeholders to build strong relationships.',
    },
    {
      icon: 'bi-gear-fill',
      title: 'Project Support',
      description: 'Provide operational and administrative support to ensure smooth project execution and problem resolution.',
    },
  ];

  return (
    <section id="about-role" className="py-5 bg-mafoi-surface border-bottom">
      <div className="container py-lg-4">
        {/* Section Header */}
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <span className="badge bg-white text-mafoi-primary border px-3 py-2 rounded-pill fw-semibold mb-2">
              OPPORTUNITY OVERVIEW
            </span>
            <h2 className="display-6 fw-bold text-mafoi-dark mb-3">About the Role</h2>
            <p className="lead-text mb-0">
              The Ma Foi Foundation is looking for a dedicated <strong>Project Executive</strong> to support project coordination,
              implementation, documentation, stakeholder communication, and day-to-day project activities. In this role, you will be
              closely involved in driving grassroots initiatives that deliver sustainable community impact.
            </p>
          </div>
        </div>

        {/* 4 Feature Cards */}
        <div className="row g-4">
          {roleHighlights.map((item, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div className="card h-100 mafoi-card p-4">
                <div className="mafoi-icon-badge mb-3">
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <h3 className="h5 fw-bold text-mafoi-dark mb-2">{item.title}</h3>
                <p className="text-secondary small mb-0 lh-base">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Candidate Profile Summary Box */}
        <div className="mt-5 p-4 rounded-3 bg-white border">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h4 className="h6 text-uppercase text-mafoi-primary fw-bold mb-1">Ideal Candidate Profile</h4>
              <p className="text-secondary mb-0 small">
                Graduates / Postgraduates in Social Work, Management, Arts, or Science with strong organizational capabilities,
                effective communication skills in English and Tamil, and a passion for community transformation.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <a href="#apply-section" className="btn btn-outline-primary btn-sm px-3 py-2 rounded-pill fw-semibold">
                Submit Your Application <i className="bi bi-chevron-right ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
