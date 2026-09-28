import React from 'react';

export default function WhyJoin() {
  const reasons = [
    {
      icon: 'bi-heart-pulse-fill',
      title: 'Meaningful Impact',
      description: 'Work on projects that contribute directly to social and community development, uplifting lives and fostering grassroots empowerment.',
    },
    {
      icon: 'bi-graph-up-arrow',
      title: 'Professional Growth',
      description: 'Gain practical experience in project management, operational monitoring, and field interventions with mentorship from seasoned leaders.',
    },
    {
      icon: 'bi-people-fill',
      title: 'Collaborative Environment',
      description: 'Work with diverse teams, community leaders, educational institutions, and corporate partners in an inclusive work culture.',
    },
    {
      icon: 'bi-lightbulb-fill',
      title: 'Learning Opportunities',
      description: 'Develop valuable skills in coordination, communication, reporting, data analysis, and end-to-end project execution.',
    },
  ];

  return (
    <section id="why-join" className="py-5 bg-white border-bottom">
      <div className="container py-lg-4">
        {/* Section Header */}
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <span className="badge bg-mafoi-light text-mafoi-dark border px-3 py-2 rounded-pill fw-semibold mb-2">
              WHY US
            </span>
            <h2 className="display-6 fw-bold text-mafoi-dark mb-3">Why Join The Ma Foi Foundation?</h2>
            <p className="lead-text mb-0">
              Founded on the values of empowerment, integrity, and positive social change, The Ma Foi Foundation offers
              a purpose-led career where your daily contributions create tangible opportunities for people.
            </p>
          </div>
        </div>

        {/* 4 Feature Cards */}
        <div className="row g-4">
          {reasons.map((reason, index) => (
            <div className="col-md-6" key={index}>
              <div className="card h-100 mafoi-card p-4 border-0 bg-mafoi-surface">
                <div className="d-flex align-items-start gap-3">
                  <div className="mafoi-icon-badge bg-white shadow-sm flex-shrink-0">
                    <i className={`bi ${reason.icon}`}></i>
                  </div>
                  <div>
                    <h3 className="h5 fw-bold text-mafoi-dark mb-2">{reason.title}</h3>
                    <p className="text-secondary small mb-0 lh-base">{reason.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key Values Strip */}
        <div className="mt-5 p-4 rounded-4 bg-mafoi-dark text-white shadow-sm">
          <div className="row text-center g-4">
            <div className="col-6 col-md-3">
              <div className="fs-3 fw-bold text-white mb-1">20+</div>
              <div className="small text-white-50">Years of Social Commitment</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="fs-3 fw-bold text-white mb-1">100k+</div>
              <div className="small text-white-50">Beneficiaries Reached</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="fs-3 fw-bold text-white mb-1">100%</div>
              <div className="small text-white-50">Ethical & Transparent Practices</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="fs-3 fw-bold text-white mb-1">Pan-India</div>
              <div className="small text-white-50">Community Footprint</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
