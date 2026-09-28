import React, { useState, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    description: '',
    resume: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const fileInputRef = useRef(null);
  const formSectionRef = useRef(null);

  // Field validation helpers
  const validateFullName = (name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) {
      return 'Please enter a valid name using alphabets only.';
    }
    // Alphabets only and single spaces between words
    const nameRegex = /^[A-Za-z]+(\s+[A-Za-z]+)*$/;
    if (!nameRegex.test(trimmed)) {
      return 'Please enter a valid name using alphabets only.';
    }
    if (trimmed.length < 2) {
      return 'Please enter a valid name using alphabets only.';
    }
    return null;
  };

  const validateContactNumber = (number) => {
    const trimmed = (number || '').trim();
    if (!trimmed) {
      return 'Please enter a valid 10-digit mobile number.';
    }
    // Indian standard mobile number: exactly 10 digits starting with 6, 7, 8, or 9
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(trimmed)) {
      return 'Please enter a valid 10-digit mobile number.';
    }
    return null;
  };

  const validateResume = (file) => {
    if (!file) {
      return 'Please upload your resume in PDF format only.';
    }
    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      return 'Please upload your resume in PDF format only.';
    }
    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeBytes) {
      return 'Resume size must not exceed 5 MB.';
    }
    return null;
  };

  const validateDescription = (desc) => {
    const trimmed = (desc || '').trim();
    if (!trimmed || trimmed.length < 50) {
      return 'Please provide at least 50 characters about yourself.';
    }
    if (trimmed.length > 1000) {
      return 'Description cannot exceed 1000 characters.';
    }
    return null;
  };

  // Change handlers
  const handleTextChange = (e) => {
    const { name, value } = e.target;

    // For Full Name: Only allow alphabetic characters and spaces
    if (name === 'fullName') {
      // Disallow numbers and special symbols on typing
      if (!/^[A-Za-z\s]*$/.test(value)) {
        return;
      }
    }

    // For Contact Number: Only allow digits and max 10 characters
    if (name === 'contactNumber') {
      const numericOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericOnly }));
      if (touched[name]) {
        const error = validateContactNumber(numericOnly);
        setFormErrors((prev) => ({ ...prev, [name]: error }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      let error = null;
      if (name === 'fullName') error = validateFullName(value);
      if (name === 'description') error = validateDescription(value);
      setFormErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    let error = null;
    if (name === 'fullName') error = validateFullName(formData.fullName);
    if (name === 'contactNumber') error = validateContactNumber(formData.contactNumber);
    if (name === 'description') error = validateDescription(formData.description);

    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setTouched((prev) => ({ ...prev, resume: true }));

    const error = validateResume(file);
    setFormErrors((prev) => ({ ...prev, resume: error }));

    if (error) {
      setFormData((prev) => ({ ...prev, resume: null }));
    } else {
      setFormData((prev) => ({ ...prev, resume: file }));
    }
  };

  const validateAll = () => {
    const nameErr = validateFullName(formData.fullName);
    const phoneErr = validateContactNumber(formData.contactNumber);
    const resumeErr = validateResume(formData.resume);
    const descErr = validateDescription(formData.description);

    const errors = {
      fullName: nameErr,
      contactNumber: phoneErr,
      resume: resumeErr,
      description: descErr,
    };

    setFormErrors(errors);
    setTouched({
      fullName: true,
      contactNumber: true,
      resume: true,
      description: true,
    });

    return !nameErr && !phoneErr && !resumeErr && !descErr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if Supabase credentials are configured
      if (!isSupabaseConfigured) {
        setServerError(
          'Supabase credentials are not configured. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env (see README.md).'
        );
        setIsSubmitting(false);
        return;
      }

      const cleanContact = formData.contactNumber.trim();

      // Step 1: Duplicate Application Check (prevent accidental duplicates)
      const { data: existingApps, error: checkError } = await supabase
        .from('project_executive_applications')
        .select('id')
        .eq('contact_number', cleanContact)
        .limit(1);

      if (checkError) {
        // If SELECT query is forbidden by RLS (e.g. strict security),
        // we log quietly and allow proceeding to insert, where unique constraint on DB catches it
        console.warn('Duplicate pre-check returned status:', checkError.message);
      } else if (existingApps && existingApps.length > 0) {
        setServerError('An application with this contact number has already been submitted.');
        setIsSubmitting(false);
        return;
      }

      // Step 2: Upload Resume PDF to Supabase Storage bucket 'resumes'
      const sanitizedName = formData.fullName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .slice(0, 30);
      const timestamp = Date.now();
      const filename = `${timestamp}_${sanitizedName}.pdf`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filename, formData.resume, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/pdf',
        });

      if (uploadError) {
        console.error('Storage Upload Error:', uploadError);
        setServerError('Unable to upload your resume. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Step 3: Retrieve File Path / Public URL
      const { data: publicUrlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(filename);

      const resumeUrl = publicUrlData?.publicUrl || filename;

      // Step 4: Insert applicant details into 'project_executive_applications' table
      const { error: insertError } = await supabase
        .from('project_executive_applications')
        .insert([
          {
            full_name: formData.fullName.trim(),
            contact_number: cleanContact,
            resume_url: resumeUrl,
            description: formData.description.trim(),
          },
        ]);

      if (insertError) {
        console.error('Database Insert Error:', insertError);

        // Check if database raised a unique violation on contact_number (error code 23505)
        if (
          insertError.code === '23505' ||
          (insertError.message && insertError.message.toLowerCase().includes('unique')) ||
          (insertError.details && insertError.details.toLowerCase().includes('already exists'))
        ) {
          setServerError('An application with this contact number has already been submitted.');
        } else {
          setServerError('Something went wrong while submitting your application. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }

      // Step 5: Successful Submission
      setSubmitSuccess(true);
      setFormData({
        fullName: '',
        contactNumber: '',
        description: '',
        resume: null,
      });
      setFormErrors({});
      setTouched({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Smooth scroll back to form container
      if (formSectionRef.current) {
        formSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Submission Exception:', err);
      setServerError('Something went wrong while submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForNewSubmission = () => {
    setSubmitSuccess(false);
    setServerError('');
    setFormData({
      fullName: '',
      contactNumber: '',
      description: '',
      resume: null,
    });
    setFormErrors({});
    setTouched({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <section id="apply-section" ref={formSectionRef} className="py-5 bg-mafoi-surface border-bottom">
      <div className="container py-lg-4">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            {/* Header */}
            <div className="text-center mb-4">
              <span className="badge bg-white text-mafoi-primary border px-3 py-2 rounded-pill fw-semibold mb-2">
                APPLICATION PORTAL
              </span>
              <h2 className="display-6 fw-bold text-mafoi-dark mb-2">Apply for Project Executive</h2>
              <p className="lead-text mb-0">
                Interested in joining us? Submit your details and our team will get in touch with you.
              </p>
            </div>

            {/* Supabase Notice if not configured */}
            {!isSupabaseConfigured && (
              <div className="alert alert-info border-info d-flex align-items-start gap-3 mb-4 shadow-sm" role="alert">
                <i className="bi bi-info-circle-fill fs-4 text-info flex-shrink-0"></i>
                <div className="small">
                  <div className="fw-bold mb-1">Supabase Connection Notice</div>
                  <div>
                    To store applications in your Supabase database and upload resumes to Supabase Storage, please configure your{' '}
                    <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in the <code>.env</code> file. Check the{' '}
                    <code>README.md</code> for exact SQL setup and storage bucket instructions.
                  </div>
                </div>
              </div>
            )}

            {/* Server Error Alert */}
            {serverError && (
              <div className="alert alert-danger d-flex align-items-center gap-3 mb-4 shadow-sm" role="alert">
                <i className="bi bi-exclamation-triangle-fill fs-4 flex-shrink-0"></i>
                <div>
                  <div className="fw-semibold">Submission Notice</div>
                  <div>{serverError}</div>
                </div>
              </div>
            )}

            {/* Success Card / Alert */}
            {submitSuccess ? (
              <div className="card border-success border-2 shadow-sm rounded-4 p-4 p-md-5 text-center bg-white">
                <div
                  className="rounded-circle bg-success bg-opacity-10 text-success d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: '72px', height: '72px' }}
                >
                  <i className="bi bi-check-circle-fill display-5"></i>
                </div>
                <h3 className="h3 fw-bold text-success mb-3">Application Submitted Successfully!</h3>
                <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '520px', lineHeight: 1.7 }}>
                  Thank you for your interest in joining <strong>The Ma Foi Foundation</strong>. Your application has been successfully
                  submitted. Our team will review your application and contact you if your profile is shortlisted.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={handleResetForNewSubmission}
                    className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold"
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              /* Application Form Card */
              <div className="card mafoi-card border-0 shadow rounded-4 p-4 p-md-5 bg-white">
                <form onSubmit={handleSubmit} noValidate>
                  {/* Field 1: Full Name */}
                  <div className="mb-4">
                    <label htmlFor="fullName" className="form-label d-flex justify-content-between">
                      <span>
                        Full Name <span className="text-danger">*</span>
                      </span>
                      <small className="text-muted fw-normal">Alphabets only</small>
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg rounded-3 ${
                        touched.fullName ? (formErrors.fullName ? 'is-invalid' : 'is-valid') : ''
                      }`}
                      id="fullName"
                      name="fullName"
                      placeholder="e.g. Dhanabal D"
                      value={formData.fullName}
                      onChange={handleTextChange}
                      onBlur={handleBlur}
                      disabled={isSubmitting}
                      required
                    />
                    {touched.fullName && formErrors.fullName && (
                      <div className="invalid-feedback fw-medium">{formErrors.fullName}</div>
                    )}
                  </div>

                  {/* Field 2: Contact Number */}
                  <div className="mb-4">
                    <label htmlFor="contactNumber" className="form-label d-flex justify-content-between">
                      <span>
                        Contact Number <span className="text-danger">*</span>
                      </span>
                      <small className="text-muted fw-normal">10-digit mobile number</small>
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light text-muted border-end-0 fw-semibold">+91</span>
                      <input
                        type="tel"
                        className={`form-control border-start-0 rounded-end-3 ${
                          touched.contactNumber ? (formErrors.contactNumber ? 'is-invalid' : 'is-valid') : ''
                        }`}
                        id="contactNumber"
                        name="contactNumber"
                        placeholder="9876543210"
                        maxLength="10"
                        value={formData.contactNumber}
                        onChange={handleTextChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                        required
                      />
                      {touched.contactNumber && formErrors.contactNumber && (
                        <div className="invalid-feedback fw-medium">{formErrors.contactNumber}</div>
                      )}
                    </div>
                  </div>

                  {/* Field 3: Resume Upload */}
                  <div className="mb-4">
                    <label htmlFor="resume" className="form-label d-flex justify-content-between">
                      <span>
                        Upload Resume <span className="text-danger">*</span>
                      </span>
                      <small className="text-muted fw-normal">PDF only (Max: 5 MB)</small>
                    </label>

                    <div
                      className={`file-upload-box ${
                        touched.resume && formErrors.resume ? 'border-danger bg-danger bg-opacity-10' : ''
                      }`}
                      onClick={() => !isSubmitting && fileInputRef.current && fileInputRef.current.click()}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          if (fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                        }
                      }}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        id="resume"
                        name="resume"
                        accept="application/pdf,.pdf"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                        required
                      />
                      <div className="text-center">
                        <i
                          className={`bi ${
                            formData.resume ? 'bi-file-earmark-check-fill text-success' : 'bi-cloud-arrow-up-fill text-mafoi-primary'
                          } display-6 mb-2 d-block`}
                        ></i>
                        {formData.resume ? (
                          <div>
                            <div className="fw-bold text-mafoi-dark mb-1">{formData.resume.name}</div>
                            <small className="text-muted">
                              File size: {formatFileSize(formData.resume.size)} (Click to change file)
                            </small>
                          </div>
                        ) : (
                          <div>
                            <div className="fw-semibold text-mafoi-dark mb-1">Click to select your PDF resume</div>
                            <small className="text-muted">Accepts PDF documents up to 5 MB</small>
                          </div>
                        )}
                      </div>
                    </div>

                    {touched.resume && formErrors.resume && (
                      <div className="text-danger small mt-2 fw-medium d-flex align-items-center gap-1">
                        <i className="bi bi-exclamation-circle-fill"></i>
                        <span>{formErrors.resume}</span>
                      </div>
                    )}
                  </div>

                  {/* Field 4: Description (Tell us about yourself) */}
                  <div className="mb-4">
                    <label htmlFor="description" className="form-label d-flex justify-content-between">
                      <span>
                        Tell us about yourself <span className="text-danger">*</span>
                      </span>
                      <span className="char-count">
                        <span className={formData.description.trim().length < 50 ? 'text-danger fw-semibold' : 'text-success fw-semibold'}>
                          {formData.description.trim().length}
                        </span>{' '}
                        / 1000 characters (min 50)
                      </span>
                    </label>
                    <textarea
                      className={`form-control rounded-3 ${
                        touched.description ? (formErrors.description ? 'is-invalid' : 'is-valid') : ''
                      }`}
                      id="description"
                      name="description"
                      rows="4"
                      placeholder="Tell us briefly about your experience, skills, education and why you are interested in this role."
                      value={formData.description}
                      onChange={handleTextChange}
                      onBlur={handleBlur}
                      maxLength="1000"
                      disabled={isSubmitting}
                      required
                    ></textarea>
                    {touched.description && formErrors.description && (
                      <div className="invalid-feedback fw-medium">{formErrors.description}</div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="mt-4 pt-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100 py-3 rounded-pill fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Application</span>
                          <i className="bi bi-send-fill fs-6"></i>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Security / Privacy reassurance */}
                  <div className="mt-3 text-center text-muted small d-flex align-items-center justify-content-center gap-2">
                    <i className="bi bi-lock-fill text-mafoi-primary"></i>
                    <span>Your application data is kept strictly confidential and secure.</span>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
