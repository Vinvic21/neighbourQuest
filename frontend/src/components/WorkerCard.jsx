import React from "react";
import { Link } from "react-router-dom";
import "../css/workerCard.css";

function WorkerCard({worker}) {
    function formatRate (rate) {
        return `Ksh ${Number(rate).toLocaleString()}/hr`

    }
    function renderStars(rating){
        const stars = []
        const roundedRating = Math.round(rating || 0)

        for (let i = 1; i<= 5; i++) {
            stars.push(
        <span
          key={i}
          className={i <= roundedRating ? "star filled" : "star"}
        >
          ★
        </span>
      );
    }
    return stars;
    }
    return (
    <Link to={`/profile/${worker.id}`} className="worker-card">
      <div className="worker-card-header">
        <div className="worker-avatar">
          {worker.name ? worker.name.charAt(0).toUpperCase() : "?"}
        </div>
        <div>
          <h3 className="worker-card-name">{worker.name}</h3>
          <p className="worker-card-skill">{worker.skillCategory}</p>
        </div>
      </div>

      <div className="worker-card-rating">
        {renderStars(worker.averageRating)}
        <span className="rating-count">
          ({worker.reviewCount || 0} reviews)
        </span>
      </div>

      <div className="worker-card-details">
        <p className="worker-card-rate">{formatRate(worker.hourlyRate)}</p>
        <p className="worker-card-location">{worker.location}</p>
      </div>

      <span
        className={
          worker.available
            ? "worker-availability available"
            : "worker-availability unavailable"
        }
      >
        {worker.available ? "Available" : "Not Available"}
      </span>
    </Link>
  );
};

export default WorkerCard;
    

