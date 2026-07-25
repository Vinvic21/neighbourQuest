import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createJob } from "../api/api";
import "../css/postJob.css"

function PostJobPage () {
    const {user, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: "",
        description:"",
        category: "plumbing",
        budget: "",
        location: "",
        deadline: ""


    })
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    function handleChange(e){
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    
    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setSubmitting(true)

        try{
            const response = await createJob(formData)
            navigate(`/jobs/${response.data.id}`)

        } catch (err) {
            setError("Failed to post job, please check the details again")
            setSubmitting(false)
        }
    }
    if (!isAuthenticated) {
        return(
      <p className="post-job-status">
        You need to be logged in as an employer to post a job.
      </p>
        )
    }
    if (user?.role !== "employer" && user?.role !== "both") {
    return (
      <p className="post-job-status">
        Only employers can post jobs. Update your role in your profile if
        this is a mistake.
      </p>
    );
    }
    return (
    <div className="post-job-page">
      <div className="post-job-card">
        <h2 className="post-job-heading">Post a Job</h2>
        <p className="post-job-subtext">
          Fill in the details below to find the right person for the task.
        </p>

        {error && <p className="post-job-error">{error}</p>}

        <form onSubmit={handleSubmit} className="post-job-form">
          <label htmlFor="title">Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="e.g. Fix leaking kitchen pipe"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe the task in detail..."
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
          ></textarea>

          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="plumbing">Plumbing</option>
            <option value="cleaning">Cleaning</option>
            <option value="electrical">Electrical</option>
            <option value="delivery">Delivery</option>
            <option value="other">Other</option>
          </select>

          <div className="post-job-row">
            <div className="post-job-col">
              <label htmlFor="budget">Budget (Ksh)</label>
              <input
                type="number"
                id="budget"
                name="budget"
                placeholder="e.g. 2000"
                value={formData.budget}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="post-job-col">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="e.g. Nairobi"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label htmlFor="deadline">Deadline</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />

          <button type="submit" className="post-job-submit-btn" disabled={submitting}>
            {submitting ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;


