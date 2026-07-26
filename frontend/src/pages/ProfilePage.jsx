import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, getReviewsForUser } from "../api/api"
import ReviewCard from "../components/ReviewCard";
import Rating from "../components/Rating"
import "../css/profile.css"

function ProfilePage (){
    const {id} = useParams()
    const {user} =useAuth()


    const [profile, setProfile] = useState(null)
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchProfileData(){
            try{
                const response = await getUserProfile(id)
                setProfile(response.data)
                
                const responser = await getReviewsForUser(id)
                setReviews(responser.data)
                setLoading(false)

            } catch (errr){
                setError("Faild to LOad Profile")
                setLoading(false)
            }
        }
        fetchProfileData()
    },[id])

    function getAvaregeRating (){
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / reviews.length).toFixed(1);

    }
    function renderReviews (){
        if (reviews.length === 0) {
            return <p className="no-reviews-message">No reviews yet.</p>;
        }
        return reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
        ))

    }

    if (loading) {
        return <p className="profile-status">Loading profile...</p>;
    }

    if (error) {
        return <p className="profile-status profile-error">{error}</p>
    }

    if (!profile) {
        return <p className="profile-status">Profile not found.</p>;
    }

    const isOwnProfile = user?.id === profile.id

    return (
    <div className="profile-page">
      <div className="profile-header-card">
        <div className="profile-avatar-large">
          {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
        </div>

        <div className="profile-header-info">
          <h2 className="profile-name">{profile.name}</h2>
          <p className="profile-role">{profile.role}</p>

          <div className="profile-rating-row">
            <Rating rating={Number(getAverageRating())} readOnly={true} />
            <span className="profile-rating-text">
              {getAverageRating()} ({reviews.length} reviews)
            </span>
          </div>

          {profile.role === "worker" && (
            <p className="profile-skill">{profile.skillCategory}</p>
          )}

          <p className="profile-location">{profile.location}</p>
        </div>

        {isOwnProfile && (
          <button className="profile-edit-btn">Edit Profile</button>
        )}
      </div>

      {profile.bio && (
        <div className="profile-bio-section">
          <h3>About</h3>
          <p>{profile.bio}</p>
        </div>
      )}

      <div className="profile-reviews-section">
        <h3>Reviews</h3>
        <div className="profile-reviews-list">{renderReviews()}</div>
      </div>
    </div>
  );
};

export default ProfilePage;


