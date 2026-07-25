import React, { useState, useEffect } from "react";
import { getWorkers } from "../api/api";
import WorkerCard from "../components/WorkerCard";
import "../css/workerList.css";

function WorkerListPage (){
    const [worker, setWorker] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")

    useEffect(() => {
        async function fetchWorkers (){
            try{
                const response = await getWorkers();
                setWorker(response.data)

            }catch (err) {
                setError("Failed to load workers. Please try again later.")
                setLoading(false)
            }
    }
    fetchWorkers()

    }, [])
    function handleSearchChange (e) {
        setSearchTerm(e.target.value)
    }
    function handleCategoryChange (e) {
        setCategoryFilter(e.target.value)
    }
    function getFilteredWorkers(){
        return workers.filter((worker) => {
        const matchesSearch = worker.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || worker.skillCategory === categoryFilter;
      return matchesSearch && matchesCategory;   
        })
    }
    function RenderWorkers (){
        const filteredWorkers = getFilteredWorkers()
        if (filteredWorkers.length === 0){
            return <p className="no-workers-message">No workers match your search.</p>

        }
        return filteredWorkers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
        ))

    }
    if (loading) {
        return <p className="worker-list-status">Loading workers...</p>;
    }

    if (error) {
        return <p className="worker-list-status worker-list-error">{error}</p>;
    }
    return (
    <div className="worker-list-page">
      <h2 className="worker-list-heading">Hire Someone</h2>

      <div className="worker-list-filters">
        <input
          type="text"
          placeholder="Search workers by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="worker-search-input"
        />

        <select
          value={categoryFilter}
          onChange={handleCategoryChange}
          className="worker-category-select"
        >
          <option value="all">All Categories</option>
          <option value="plumbing">Plumbing</option>
          <option value="cleaning">Cleaning</option>
          <option value="electrical">Electrical</option>
          <option value="delivery">Delivery</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="worker-list-grid">{renderWorkers()}</div>
    </div>
  );
};

export default WorkerListPage;
