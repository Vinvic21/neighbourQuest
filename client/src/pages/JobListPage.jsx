import React , {useState, useEffect} from "react"
import { getJobs } from "../api/api"
import JobCard from "../components/JobCard"
import "../css/jobList.css"

function JobListPage () {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [ categoryFilter, setCategoryFilter] = useState("all")

    useEffect (() => {
        async function fetchJobs() {
            try{
                const response = await getJobs()
                setJobs(response.data)
                setLoading(false)
            
            }catch (err) {
                setError("Faled to LOad Jobs. PLease try again later")
            }
        }
        fetchJobs()

    }, [])
    function handleSearchChange(e) {
        setSearchTerm(e.target.value)
    }
    function handleCategoryChange (e) {
        setCategoryFilter(e.target.value)
    }
    function getFilteredJobs(){
        return jobs.filter((job) => {
            const matchesSearch = job.title 
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
            const matchesCategory = categoryFilter === "all" || job.category === categoryFilter;
            return matchesSearch && matchesCategory
        })
    }
    function renderJobs (){
        const filteredJobs = getFilteredJobs()
        if (filteredJobs.length === 0) {
           return <p className="no-jobs-message">No jobs match your search.</p>; 
        } 
        return filteredJobs.map((job) => <JobCard key={job.id} job={job} />);
        
    }
    if (loading) {
    return <p className="job-list-status">Loading jobs...</p>;
    }

    if (error) {
        return <p className="job-list-status job-list-error">{error}</p>;
    }
    return (
    <div className="job-list-page">
      <h2 className="job-list-heading">Find Work</h2>

      <div className="job-list-filters">
        <input
          type="text"
          placeholder="Search jobs by title..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="job-search-input"
        />

        <select
          value={categoryFilter}
          onChange={handleCategoryChange}
          className="job-category-select"
        >
          <option value="all">All Categories</option>
          <option value="plumbing">Plumbing</option>
          <option value="cleaning">Cleaning</option>
          <option value="electrical">Electrical</option>
          <option value="delivery">Delivery</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="job-list-grid">{renderJobs()}</div>
    </div>
  );
};

export default JobListPage;
