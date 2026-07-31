import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import  {useAuth} from "../context/AuthContext"
import { getJobById, applyToJob } from "../api/api";
import "../css/jobDetail.css";

function JobDetailPage (){
    const {id} = useParams()
    const {user, isAuthenticated} = useAuth()
    const navigate = useNavigate()

    const [job, setJob] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [applying, setApllying] = useState(false)
    const [applySuccess, setApplySuccess] = useState(false)
    const [applyError, setApplyError] = useState("");

    useEffect(() => {
        async function fetchJob() {
            try{
                const response = await getJobById(id)
                setJob(response.data)
                setLoading(false)
            } catch (err) {
                setError("Failed to get Job Detauls")

            }
        }
        fetchJob();
    },[id]);

    function formatBudget(budget){
        return`Kshs ${Number(budget).toLocaleString()}`;
    }
    function formatDeadline(deadline) {
        const date = new Date(deadline)
        return date.toLocaleString("en-KE",{
            day: "numeric",
            month: "short",
            year: "numeric"
        })
    }
    async function handleApply (){
        if (!isAuthenticated) {
            navigate('/login')
            return;
        }
        setApllying(true)
        setApplyError("")
        try{
            await applyToJob(id)
            setApplySuccess(true)
            setApllying(false)

        } catch {
            setApplyError("CAould not submit your Application , try again")

        }
    }
    if (loading) {
    return <p className="job-detail-status">Loading job details...</p>;
    }

    if (error) {
        return <p className="job-detail-status job-detail-error">{error}</p>;
     }

    if (!job) {
        return <p className="job-detail-status">Job not found.</p>;
    }
    const canApply =
    isAuthenticated && (user?.role === "worker" || user?.role === "both");

     return (
    <div className="job-detail-page">
      <div className="job-detail-card">
        <div className="job-detail-header">
          <h2 className="job-detail-title">{job.title}</h2>
          <span className="job-detail-status-badge">{job.status}</span>
        </div>

        <p className="job-detail-category">{job.category}</p>

        <div className="job-detail-meta">
          <div className="job-detail-meta-item">
            <span className="meta-label">Budget</span>
            <span className="meta-value">{formatBudget(job.budget)}</span>
          </div>
          <div className="job-detail-meta-item">
            <span className="meta-label">Location</span>
            <span className="meta-value">{job.location}</span>
          </div>
          <div className="job-detail-meta-item">
            <span className="meta-label">Deadline</span>
            <span className="meta-value">{formatDeadline(job.deadline)}</span>
          </div>
        </div>

        <div className="job-detail-description">
          <h3>Description</h3>
          <p>{job.description}</p>
        </div>

        <div className="job-detail-employer">
          <h3>Posted by</h3>
          <p>{job.employerName || "Employer"}</p>
        </div>

        {applySuccess ? (
          <p className="apply-success-message">
            Application submitted successfully!
          </p>
        ) : (
          <>
            {applyError && <p className="apply-error-message">{applyError}</p>}

            {canApply && (
              <button
                className="apply-btn"
                onClick={handleApply}
                disabled={applying}
              >
                {applying ? "Applying..." : "Apply for this Job"}
              </button>
            )}

            {!isAuthenticated && (
              <button className="apply-btn" onClick={handleApply}>
                Login to Apply
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobDetailPage;

            
    


