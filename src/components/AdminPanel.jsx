import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function AdminPanel({ isOpen, onClose }) {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState('');

  // Fetch applications from Supabase
  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase credentials are not configured in your .env file.');
      }

      const { data, error: fetchError } = await supabase
        .from('project_executive_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError(err.message || 'Failed to fetch application records from Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchApplications();
      // Lock background scrolling
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedApplicant) {
          setSelectedApplicant(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, selectedApplicant]);

  // Filtered applications based on search query
  const filteredApplications = useMemo(() => {
    if (!searchQuery.trim()) return applications;
    const q = searchQuery.toLowerCase().trim();
    return applications.filter(
      (app) =>
        app.full_name?.toLowerCase().includes(q) ||
        app.contact_number?.includes(q) ||
        app.description?.toLowerCase().includes(q)
    );
  }, [applications, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = applications.length;
    const today = new Date().toISOString().slice(0, 10);
    const todayCount = applications.filter((app) =>
      app.created_at?.startsWith(today)
    ).length;
    return { total, todayCount };
  }, [applications]);

  // Format timestamp to localized readable string (IST)
  const formatDateTime = (isoString) => {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  // Export to Excel with clickable hyperlinks
  const handleExportExcel = () => {
    if (applications.length === 0) {
      alert('No registration data available to export.');
      return;
    }

    setIsExporting(true);
    try {
      // 1. Prepare Header and Rows
      const headers = [
        'S.No',
        'Applicant Name',
        'Contact Number',
        'Resume Document Link',
        'Direct Resume URL',
        'Candidate Statement',
        'Submission Date & Time (IST)',
        'Application Reference ID',
      ];

      const rows = applications.map((app, index) => {
        const formattedDate = formatDateTime(app.created_at);
        const resumeUrl = app.resume_url || '';

        // Excel cell with native clickable hyperlink
        const resumeCell = resumeUrl
          ? {
              t: 's',
              v: 'Open & Download Resume (PDF)',
              l: {
                Target: resumeUrl,
                Tooltip: 'Click to open candidate resume in browser',
              },
            }
          : { t: 's', v: 'No Resume' };

        return [
          index + 1,
          app.full_name || '',
          app.contact_number || '',
          resumeCell,
          resumeUrl,
          app.description || '',
          formattedDate,
          app.id || '',
        ];
      });

      // 2. Build Worksheet
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

      // Set optimal column widths
      ws['!cols'] = [
        { wch: 8 },  // S.No
        { wch: 25 }, // Name
        { wch: 18 }, // Contact
        { wch: 32 }, // Resume Clickable Link
        { wch: 60 }, // Direct Resume URL
        { wch: 55 }, // Candidate Statement
        { wch: 26 }, // Date & Time
        { wch: 38 }, // Application ID
      ];

      // 3. Build Workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Registrations');

      // 4. Generate & Trigger Download
      const todayStr = new Date().toISOString().slice(0, 10);
      const filename = `Ma_Foi_Project_Executive_Applications_${todayStr}.xlsx`;
      XLSX.writeFile(wb, filename);

      setExportNotice(`Successfully exported ${applications.length} registration(s) to ${filename}`);
      setTimeout(() => setExportNotice(''), 6000);
    } catch (err) {
      console.error('Excel Export Error:', err);
      alert('Error creating Excel file. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="admin-modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-2 p-md-4"
      style={{
        zIndex: 1060,
        backgroundColor: 'rgba(0, 24, 51, 0.72)',
        backdropFilter: 'blur(6px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-portal-title"
    >
      <div
        className="card border-0 shadow-lg w-100 h-100 d-flex flex-column rounded-4 overflow-hidden"
        style={{
          maxWidth: '1240px',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Modal Top Header Bar */}
        <div className="bg-mafoi-dark text-white px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom border-secondary border-opacity-25">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center bg-white text-mafoi-dark rounded-3 shadow-sm"
              style={{ width: '42px', height: '42px' }}
            >
              <i className="bi bi-shield-check fs-4"></i>
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h5 id="admin-portal-title" className="text-white fw-bold mb-0">
                  Admin Recruitment Portal
                </h5>
                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill small px-2">
                  <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
                  Supabase Connected
                </span>
              </div>
              <small className="text-white-50">
                The Ma Foi Foundation • Role: Project Executive
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-light btn-sm d-flex align-items-center gap-1.5 px-3 py-1.5"
              onClick={fetchApplications}
              disabled={isLoading}
              title="Refresh registration data from Supabase"
            >
              <i className={`bi bi-arrow-clockwise ${isLoading ? 'spin-animation' : ''}`}></i>
              <span className="d-none d-sm-inline">Refresh</span>
            </button>

            <button
              type="button"
              className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '36px', height: '36px' }}
              onClick={onClose}
              aria-label="Close Admin Panel"
            >
              <i className="bi bi-x-lg text-mafoi-dark"></i>
            </button>
          </div>
        </div>

        {/* Export Success Notification Banner */}
        {exportNotice && (
          <div className="alert alert-success rounded-0 mb-0 py-2.5 px-4 d-flex align-items-center justify-content-between small">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill text-success fs-6"></i>
              <span>{exportNotice}</span>
            </div>
            <button
              type="button"
              className="btn-close btn-close-sm"
              onClick={() => setExportNotice('')}
            ></button>
          </div>
        )}

        {/* Metrics & Control Bar */}
        <div className="bg-light px-4 py-3 border-bottom">
          <div className="row g-3 align-items-center">
            {/* Metric 1: Total Registrations */}
            <div className="col-6 col-md-3">
              <div className="bg-white p-3 rounded-3 border shadow-xs d-flex align-items-center gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center text-primary"
                  style={{ width: '44px', height: '44px', backgroundColor: '#EAF4FF' }}
                >
                  <i className="bi bi-people-fill fs-4"></i>
                </div>
                <div>
                  <div className="text-muted small fw-semibold">Total Registrations</div>
                  <div className="h4 fw-bold mb-0 text-mafoi-dark">{stats.total}</div>
                </div>
              </div>
            </div>

            {/* Metric 2: Today's Registrations */}
            <div className="col-6 col-md-3">
              <div className="bg-white p-3 rounded-3 border shadow-xs d-flex align-items-center gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center text-success"
                  style={{ width: '44px', height: '44px', backgroundColor: '#E8F5E9' }}
                >
                  <i className="bi bi-calendar2-check-fill fs-4"></i>
                </div>
                <div>
                  <div className="text-muted small fw-semibold">Received Today</div>
                  <div className="h4 fw-bold mb-0 text-success">{stats.todayCount}</div>
                </div>
              </div>
            </div>

            {/* Action Bar: Search & Excel Download */}
            <div className="col-12 col-md-6 d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-end gap-2">
              {/* Search Box */}
              <div className="input-group input-group-sm flex-grow-1" style={{ maxWidth: '280px' }}>
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search name, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="btn btn-outline-secondary border-start-0"
                    type="button"
                    onClick={() => setSearchQuery('')}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>

              {/* Excel Download Button */}
              <button
                type="button"
                className="btn btn-success btn-sm d-flex align-items-center justify-content-center gap-2 px-3 py-2 fw-semibold shadow-sm"
                onClick={handleExportExcel}
                disabled={applications.length === 0 || isExporting}
                style={{ backgroundColor: '#107C41', borderColor: '#107C41' }}
              >
                <i className="bi bi-file-earmark-excel-fill fs-6"></i>
                <span>{isExporting ? 'Generating Excel...' : 'Download Excel (.xlsx)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area / Registrations Table */}
        <div className="flex-grow-1 overflow-auto p-4 bg-white">
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill fs-5"></i>
              <div>{error}</div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading applications...</span>
              </div>
              <h6 className="text-muted fw-semibold">Loading registration records...</h6>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-3"
                style={{ width: '70px', height: '70px' }}
              >
                <i className="bi bi-inbox fs-1 text-secondary"></i>
              </div>
              <h5>No Applications Received Yet</h5>
              <p className="small text-muted mb-0">
                When candidates submit applications through the portal, they will appear here in real-time.
              </p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-search fs-2 mb-2 d-block"></i>
              <h6>No matching registrations found for "{searchQuery}"</h6>
              <button
                className="btn btn-link btn-sm text-decoration-none"
                onClick={() => setSearchQuery('')}
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="table-responsive border rounded-3">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light border-bottom text-uppercase small fw-bold text-muted">
                  <tr>
                    <th scope="col" style={{ width: '60px' }} className="ps-3">
                      #
                    </th>
                    <th scope="col" style={{ minWidth: '180px' }}>
                      Applicant Name
                    </th>
                    <th scope="col" style={{ minWidth: '150px' }}>
                      Contact Number
                    </th>
                    <th scope="col" style={{ minWidth: '160px' }}>
                      Submitted On
                    </th>
                    <th scope="col" style={{ minWidth: '160px' }}>
                      Resume / Document
                    </th>
                    <th scope="col" style={{ minWidth: '220px' }}>
                      Self Description
                    </th>
                    <th scope="col" style={{ width: '100px' }} className="text-end pe-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredApplications.map((app, index) => (
                    <tr key={app.id || index}>
                      <td className="ps-3 text-muted fw-semibold">{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-mafoi-light text-mafoi-dark fw-bold d-flex align-items-center justify-content-center"
                            style={{ width: '34px', height: '34px', fontSize: '0.85rem' }}
                          >
                            {app.full_name?.charAt(0)?.toUpperCase() || 'A'}
                          </div>
                          <div>
                            <div className="fw-bold text-mafoi-dark">{app.full_name}</div>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                              ID: {app.id?.slice(0, 8)}...
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <a
                          href={`tel:${app.contact_number}`}
                          className="text-decoration-none fw-semibold text-primary d-inline-flex align-items-center gap-1.5"
                        >
                          <i className="bi bi-telephone-fill small"></i>
                          <span>{app.contact_number}</span>
                        </a>
                      </td>
                      <td>
                        <span className="small text-muted">{formatDateTime(app.created_at)}</span>
                      </td>
                      <td>
                        {app.resume_url ? (
                          <div className="d-flex align-items-center gap-1.5">
                            <a
                              href={app.resume_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1.5 px-2.5 py-1"
                              title="Click to view resume in browser"
                            >
                              <i className="bi bi-file-earmark-pdf-fill text-danger"></i>
                              <span>View PDF</span>
                              <i className="bi bi-box-arrow-up-right" style={{ fontSize: '0.7rem' }}></i>
                            </a>
                            <a
                              href={app.resume_url}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-light btn-sm border text-muted px-2 py-1"
                              title="Download document directly"
                            >
                              <i className="bi bi-download"></i>
                            </a>
                          </div>
                        ) : (
                          <span className="badge bg-secondary">No Document</span>
                        )}
                      </td>
                      <td>
                        <div
                          className="text-muted small text-truncate"
                          style={{ maxWidth: '240px' }}
                          title={app.description}
                        >
                          {app.description || '-'}
                        </div>
                      </td>
                      <td className="text-end pe-3">
                        <button
                          type="button"
                          className="btn btn-light btn-sm border d-inline-flex align-items-center gap-1"
                          onClick={() => setSelectedApplicant(app)}
                          title="View complete application profile"
                        >
                          <i className="bi bi-eye"></i>
                          <span className="d-none d-lg-inline">Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="bg-light px-4 py-2.5 border-top d-flex flex-wrap align-items-center justify-content-between small text-muted">
          <div>
            Showing <strong className="text-dark">{filteredApplications.length}</strong> of{' '}
            <strong className="text-dark">{applications.length}</strong> total registrations
          </div>
          <div className="d-flex align-items-center gap-3">
            <span>
              Keyboard Shortcut: <kbd className="bg-white text-dark border">Ctrl</kbd> +{' '}
              <kbd className="bg-white text-dark border">Shift</kbd> +{' '}
              <kbd className="bg-white text-dark border">M</kbd>
            </span>
            <span>•</span>
            <span>
              Press <kbd className="bg-white text-dark border">Esc</kbd> to close
            </span>
          </div>
        </div>
      </div>

      {/* Applicant Full Profile Modal Detail */}
      {selectedApplicant && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            zIndex: 1070,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setSelectedApplicant(null)}
        >
          <div
            className="card border-0 shadow-lg w-100 rounded-4 overflow-hidden"
            style={{ maxWidth: '650px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-mafoi-dark text-white px-4 py-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-person-badge fs-5"></i>
                <h6 className="fw-bold mb-0 text-white">Applicant Profile Details</h6>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setSelectedApplicant(null)}
              ></button>
            </div>

            <div className="p-4 bg-white">
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                <div
                  className="rounded-circle bg-mafoi-light text-mafoi-dark fw-bold d-flex align-items-center justify-content-center fs-4"
                  style={{ width: '56px', height: '56px' }}
                >
                  {selectedApplicant.full_name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div>
                  <h5 className="fw-bold text-mafoi-dark mb-0">{selectedApplicant.full_name}</h5>
                  <div className="text-muted small">
                    Submitted on: {formatDateTime(selectedApplicant.created_at)}
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="text-muted small fw-semibold mb-1">Contact Number</div>
                  <div className="fw-bold fs-6">
                    <a
                      href={`tel:${selectedApplicant.contact_number}`}
                      className="text-decoration-none text-primary d-inline-flex align-items-center gap-1.5"
                    >
                      <i className="bi bi-telephone-fill"></i>
                      <span>{selectedApplicant.contact_number}</span>
                    </a>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="text-muted small fw-semibold mb-1">Resume Document</div>
                  {selectedApplicant.resume_url ? (
                    <a
                      href={selectedApplicant.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2 px-3 py-1.5"
                    >
                      <i className="bi bi-file-earmark-pdf-fill"></i>
                      <span>View & Download PDF</span>
                      <i className="bi bi-box-arrow-up-right"></i>
                    </a>
                  ) : (
                    <span className="badge bg-secondary">No Resume</span>
                  )}
                </div>

                <div className="col-12">
                  <div className="text-muted small fw-semibold mb-1">Candidate Statement</div>
                  <div
                    className="p-3 bg-light rounded-3 small text-dark border"
                    style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
                  >
                    {selectedApplicant.description}
                  </div>
                </div>

                <div className="col-12">
                  <div className="text-muted small fw-semibold mb-1">Direct Resume URL</div>
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      className="form-control bg-light"
                      readOnly
                      value={selectedApplicant.resume_url || ''}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedApplicant.resume_url || '');
                        alert('Resume URL copied to clipboard!');
                      }}
                      title="Copy URL"
                    >
                      <i className="bi bi-clipboard"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm px-4"
                  onClick={() => setSelectedApplicant(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
