import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {getAdminUsers,suspendUser, reactivateUser, getAdminJobs, deleteJobAdmin, getAdminReviews, deleteReviewAdmin,} from "../api/api";
import "../css/admin.css";

function AdminDashboardPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    async function fetchAll() {
      try {
        const [usersRes, jobsRes, reviewsRes] = await Promise.all([
          getAdminUsers(),
          getAdminJobs(),
          getAdminReviews(),
        ]);
        setUsers(usersRes.data);
        setJobs(jobsRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        setError(
          err.response?.status === 403
            ? "You don't have permission to view this page."
            : "Failed to load admin data."
        );
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchAll();
  }, [user]);

  async function handleSuspend(userId) {
    setActionError("");
    try {
      await suspendUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: false } : u))
      );
    } catch (err) {
      setActionError(err.response?.data?.error || "Failed to suspend user.");
    }
  }

  async function handleReactivate(userId) {
    setActionError("");
    try {
      await reactivateUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: true } : u))
      );
    } catch (err) {
      setActionError(err.response?.data?.error || "Failed to reactivate user.");
    }
  }

  async function handleDeleteJob(jobId) {
    if (!window.confirm("Delete this job? This cannot be undone.")) return;
    setActionError("");
    try {
      await deleteJobAdmin(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err) {
      setActionError(err.response?.data?.error || "Failed to delete job.");
    }
  }

  async function handleDeleteReview(reviewId) {
    if (!window.confirm("Delete this review? This cannot be undone.")) return;
    setActionError("");
    try {
      await deleteReviewAdmin(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      setActionError(err.response?.data?.error || "Failed to delete review.");
    }
  }

  if (loading) {
    return <p className="admin-status">Loading admin dashboard...</p>;
  }

  if (error) {
    return <p className="admin-status admin-error">{error}</p>;
  }

  return (
    <div className="admin-page">
      <h2 className="admin-heading">Admin Dashboard</h2>

      <nav className="admin-tabs">
        <button
          className={activeTab === "users" ? "admin-tab active" : "admin-tab"}
          onClick={() => setActiveTab("users")}
        >
          Users ({users.length})
        </button>
        <button
          className={activeTab === "jobs" ? "admin-tab active" : "admin-tab"}
          onClick={() => setActiveTab("jobs")}
        >
          Jobs ({jobs.length})
        </button>
        <button
          className={activeTab === "reviews" ? "admin-tab active" : "admin-tab"}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews ({reviews.length})
        </button>
      </nav>

      {actionError && <p className="admin-action-error">{actionError}</p>}

      {activeTab === "users" && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  {u.is_admin ? (
                    <span className="admin-badge admin-badge-admin">Admin</span>
                  ) : u.is_active ? (
                    <span className="admin-badge admin-badge-active">Active</span>
                  ) : (
                    <span className="admin-badge admin-badge-suspended">Suspended</span>
                  )}
                </td>
                <td>
                  {!u.is_admin &&
                    (u.is_active ? (
                      <button className="admin-suspend-btn" onClick={() => handleSuspend(u.id)}>
                        Suspend
                      </button>
                    ) : (
                      <button className="admin-reactivate-btn" onClick={() => handleReactivate(u.id)}>
                        Reactivate
                      </button>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === "jobs" && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Location</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.category}</td>
                <td>{job.location}</td>
                <td>{job.status}</td>
                <td>
                  <button className="admin-delete-btn" onClick={() => handleDeleteJob(job.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === "reviews" && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Reviewer</th>
              <th>Rating</th>
              <th>Comment</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.reviewerName}</td>
                <td>{review.rating} / 5</td>
                <td>{review.comment}</td>
                <td>
                  <button className="admin-delete-btn" onClick={() => handleDeleteReview(review.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboardPage;