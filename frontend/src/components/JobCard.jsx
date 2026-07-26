import React from "react";
import { Link } from "react-router-dom";
import "../css/jobCard.css";

const JobCard = ({ job }) => {
  function formatBudget(budget) {
    return `Ksh ${Number(budget).toLocaleString()}`;
  }

  function formatDeadline(deadline) {
    const date = new Date(deadline);
    return date.toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusClass(status) {
    if (status === "open") return "status-open";
    if (status === "in_progress") return "status-progress";
    if (status === "completed") return "status-completed";
    return "status-default";
  }

  return (
    <Link to={`/jobs/${job.id}`} className="job-card">
      <div className="job-card-header">
        <h3 className="job-card-title">{job.title}</h3>
        <span className={`job-card-status ${getStatusClass(job.status)}`}>
          {job.status}
        </span>
      </div>

      <p className="job-card-category">{job.category}</p>

      <div className="job-card-details">
        <p className="job-card-budget">{formatBudget(job.budget)}</p>
        <p className="job-card-location">{job.location}</p>
      </div>

      <p className="job-card-deadline">
        Deadline: {formatDeadline(job.deadline)}
      </p>
    </Link>
  );
};

export default JobCard;
