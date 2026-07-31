import React from "react";
import Rating from "./Rating";
import "../css/reviewCard.css";

function ReviewCard({review}){
    function formatDate (dateString){
        const date = new Date(dateString)
        return date.toLocaleDateString ("en-KE", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
    }
    return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="review-avatar">
          {review.reviewerName ? review.reviewerName.charAt(0).toUpperCase() : "?"}
        </div>
        <div className="review-header-text">
          <p className="review-reviewer-name">{review.reviewerName}</p>
          <Rating rating={review.rating} readOnly={true} />
        </div>
        <span className="review-date">{formatDate(review.createdAt)}</span>
      </div>
      <p className="review-comment">{review.comment}</p>
    </div>
  )
}
export default ReviewCard;
