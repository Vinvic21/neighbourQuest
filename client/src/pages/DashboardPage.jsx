import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {getMyApplications, getJobsPostedByEmployer, getApplicationsForJob, updateApplicationStatus, updateJobStatus, submitReview } from "../api/api";
import Rating from "../components/Rating";
import { getWhatsAppLink } from "../utils/whatsapp";
import "../css/dashboard.css";

function DashboardPage (){
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("applications");
  const [applications, setApplications] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [applicantsByJob, setApplicantsByJob] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const isWorker = user?.role === "worker" || user?.role === "both";
  const isEmployer = user?.role === "employer" || user?.role === "both";

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        if (isWorker) {
          const response = await getMyApplications();
          setApplications(response.data);
        }

        if (isEmployer) {
          const jobsResponse = await getJobsPostedByEmployer(user.id);
          setPostedJobs(jobsResponse.data);

          const applicantsMap = {};
          for (const job of jobsResponse.data) {
            const applicantsResponse = await getApplicationsForJob(job.id);
            applicantsMap[job.id] = applicantsResponse.data;
          }
          setApplicantsByJob(applicantsMap);
        }
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  function handleTabChange (tab)  {
    setActiveTab(tab);
  };

  async function handleApplicantDecision(applicationId, jobId, status)  {
    try {
      await updateApplicationStatus(applicationId, status)
      setApplicantsByJob((prev) => ({
        ...prev,
        [jobId]: prev[jobId].map((app) =>
          app.id === applicationId ? { ...app, status } : app
        ),
      }))
    } catch (err) {
      setError("Failed to update application status.")
    }
  };

  async function handleMarkJobCompleted(jobId) {
    try {
      await updateJobStatus(jobId, "completed")
      setPostedJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, status: "completed" } : job))
      )
    } catch (err) {
      setError("Failed to update job status.")
    }
  };

  function openReviewForm (revieweeId, jobId) {
    setReviewTarget({ revieweeId, jobId })
    setReviewRating(0)
    setReviewComment("")
    setReviewError("")
  };

  function closeReviewForm (){
    setReviewTarget(null);
  };

 async function handleReviewSubmit(){
    if (reviewRating === 0) {
      setReviewError("Please select a rating.");
      return;
    }

    setReviewSubmitting(true);
    setReviewError("");

    try {
      await submitReview({
        jobId: reviewTarget.jobId,
        revieweeId: reviewTarget.revieweeId,
        rating: reviewRating,
        comment: reviewComment,
      });
      closeReviewForm();
    } catch (err) {
      setReviewError(err.response?.data?.error || "Failed to submit review. Please try again.")
    } finally {
      setReviewSubmitting(false);
    }
  };

  function renderApplicationsTab (){
    if (applications.length === 0) {
      return <p className="dashboard-empty">You haven't applied to any jobs yet.</p>;
    }

    return applications.map((app) => (
      <div key={app.id} className="dashboard-item-card">
        <div className="dashboard-item-header">
          <h4>{app.jobTitle}</h4>
          <span className={`status-badge status-${app.status}`}>
            {app.status}
          </span>
        </div>
        <p className="dashboard-item-sub">Employer: {app.employerName}</p>

        {app.employerPhone && (
          <a
            className="whatsapp-btn"
            href={getWhatsAppLink(
              app.employerPhone,
              `Hi, I'm messaging about the job "${app.jobTitle}" on NeighborQuest.`
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Message on WhatsApp
          </a>
        )}

        {app.status === "completed" && (
          <button
            className="review-trigger-btn"
            onClick={() => openReviewForm(app.employerId, app.jobId)}
          >
            Rate Employer
          </button>
        )}
      </div>
    ));
  };

  function renderPostedJobsTab () {
    if (postedJobs.length === 0) {
      return <p className="dashboard-empty">You haven't posted any jobs yet.</p>;
    }

    return postedJobs.map((job) => (
      <div key={job.id} className="dashboard-item-card">
        <div className="dashboard-item-header">
          <h4>{job.title}</h4>
          <span className={`status-badge status-${job.status}`}>
            {job.status}
          </span>
        </div>

        <p className="dashboard-item-sub">
          Applicants: {applicantsByJob[job.id]?.length || 0}
        </p>

        {job.status !== "completed" && (
          <button
            className="mark-completed-btn"
            onClick={() => handleMarkJobCompleted(job.id)}
          >
            Mark as Completed
          </button>
        )}

        <div className="applicants-list">
          {applicantsByJob[job.id]?.map((applicant) => (
            <div key={applicant.id} className="applicant-row">
              <span>{applicant.workerName}</span>

              {applicant.workerPhone && (
                <a
                  className="whatsapp-btn"
                  href={getWhatsAppLink(
                    applicant.workerPhone,
                    `Hi, I'm messaging about your application for "${job.title}" on NeighborQuest.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              )}

              {applicant.status === "applied" && (
                <div className="applicant-actions">
                  <button
                    className="accept-btn"
                    onClick={() =>
                      handleApplicantDecision(applicant.id, job.id, "accepted")
                    }
                  >
                    Accept
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() =>
                      handleApplicantDecision(applicant.id, job.id, "rejected")
                    }
                  >
                    Reject
                  </button>
                </div>
              )}

              {applicant.status !== "applied" && (
                <span className={`status-badge status-${applicant.status}`}>
                  {applicant.status}
                </span>
              )}

              {job.status === "completed" && applicant.status === "accepted" && (
                <button
                  className="review-trigger-btn"
                  onClick={() => openReviewForm(applicant.workerId, job.id)}
                >
                  Rate Worker
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    ));
  };

  if (loading) {
    return <p className="dashboard-status">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="dashboard-status dashboard-error">{error}</p>;
  }

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dashboard-user-info">
          <div className="dashboard-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>
          <p className="dashboard-username">{user?.name}</p>
          <p className="dashboard-userrole">{user?.role}</p>
        </div>

        <nav className="dashboard-nav">
          {isWorker && (
            <button
              className={activeTab === "applications" ? "nav-item active" : "nav-item"}
              onClick={() => handleTabChange("applications")}
            >
              My Applications
            </button>
          )}

          {isEmployer && (
            <button
              className={activeTab === "postedJobs" ? "nav-item active" : "nav-item"}
              onClick={() => handleTabChange("postedJobs")}
            >
              My Posted Jobs
            </button>
          )}
        </nav>
      </aside>

      <main className="dashboard-main">
        <h2 className="dashboard-heading">Welcome, {user?.name}</h2>

        {activeTab === "applications" && isWorker && renderApplicationsTab()}
        {activeTab === "postedJobs" && isEmployer && renderPostedJobsTab()}
      </main>

      {reviewTarget && (
        <div className="review-modal-overlay">
          <div className="review-modal">
            <h3>Leave a Review</h3>

            <Rating
              rating={reviewRating}
              readOnly={false}
              onChange={(value) => setReviewRating(value)}
            />

            <textarea
              placeholder="Write a comment..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows="4"
            ></textarea>

            {reviewError && <p className="review-modal-error">{reviewError}</p>}

            <div className="review-modal-actions">
              <button className="review-cancel-btn" onClick={closeReviewForm}>
                Cancel
              </button>
              <button
                className="review-submit-btn"
                onClick={handleReviewSubmit}
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;