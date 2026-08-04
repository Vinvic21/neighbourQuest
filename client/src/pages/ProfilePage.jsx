import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, getReviewsForUser, updateUserProfile } from "../api/api"
import ReviewCard from "../components/ReviewCard";
import Rating from "../components/Rating"
import { getWhatsAppLink } from "../utils/whatsapp";
import "../css/profile.css"

function ProfilePage (){
    const {id} = useParams()
    const {user} =useAuth()


    const [profile, setProfile] = useState(null)
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({})
    const [saveError, setSaveError] = useState("")
    const [saving, setSaving] = useState(false)

    // only meaningful for a "both" role user viewing/editing their own profile
    const [viewType, setViewType] = useState(null)

    useEffect(() => {
        async function fetchProfileData(){
            try{
                const response = await getUserProfile(id, viewType)
                setProfile(response.data)
                setEditData(response.data)
                
                const responser = await getReviewsForUser(id)
                setReviews(responser.data)
                setLoading(false)

            } catch (errr){
                setError("Faild to LOad Profile")
                setLoading(false)
            }
        }
        fetchProfileData()
    },[id, viewType])

    function getAverageRating (){
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

    function handleEditChange(e) {
        setEditData({ ...editData, [e.target.name]: e.target.value })
    }

    function startEditing() {
        setIsEditing(true)
        setSaveError("")
    }

    function cancelEditing() {
        setIsEditing(false)
        setEditData(profile)
        setSaveError("")
    }

    async function handleSaveProfile(e) {
        e.preventDefault()
        setSaving(true)
        setSaveError("")
        try {
            const response = await updateUserProfile(id, editData, viewType)
            setProfile(response.data)
            setIsEditing(false)
        } catch (err) {
            setSaveError("Failed to save changes. Please try again.")
        }
        setSaving(false)
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

    const isOwnProfile = user?.id === profile.user_id

    return (
    <div className="profile-page">
      <div className="profile-header-card">
        <div className="profile-avatar-large">
          {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
        </div>

        <div className="profile-header-info">
          {!isEditing ? (
            <>
              <h2 className="profile-name">{profile.name}</h2>
              <p className="profile-role">{profile.role}</p>

              {isOwnProfile && user?.role === "both" && !isEditing && (
                <div className="profile-type-toggle">
                  <button
                    type="button"
                    className={viewType !== "employer" ? "active" : ""}
                    onClick={() => setViewType("worker")}
                  >
                    Worker Profile
                  </button>
                  <button
                    type="button"
                    className={viewType === "employer" ? "active" : ""}
                    onClick={() => setViewType("employer")}
                  >
                    Employer Profile
                  </button>
                </div>
              )}

              <div className="profile-rating-row">
                <Rating rating={Number(getAverageRating())} readOnly={true} />
                <span className="profile-rating-text">
                  {getAverageRating()} ({reviews.length} reviews)
                </span>
              </div>

              {profile.role === "worker" && (
                <p className="profile-skill">{profile.skill_category}</p>
              )}

              <p className="profile-location">{profile.location}</p>

              {isOwnProfile && (
                <p className="profile-phone">
                  {profile.phone ? profile.phone : "No phone number on file"}
                </p>
              )}

              {!isOwnProfile && profile.phone && (
                <a
                  className="whatsapp-btn"
                  href={getWhatsAppLink(
                    profile.phone,
                    `Hi ${profile.name || ""}, I found your profile on NeighborQuest.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Message on WhatsApp
                </a>
              )}
            </>
          ) : (
            <form onSubmit={handleSaveProfile} className="profile-edit-form">
              {saveError && <p className="profile-edit-error">{saveError}</p>}

              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="e.g. 0712345678"
                value={editData.phone || ""}
                onChange={handleEditChange}
              />

              {profile.role === "worker" && (
                <>
                  <label>Skill Category</label>
                  <input
                    type="text"
                    name="skill_category"
                    value={editData.skill_category || ""}
                    onChange={handleEditChange}
                  />

                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={editData.bio || ""}
                    onChange={handleEditChange}
                    rows="3"
                  ></textarea>

                  <label>Hourly Rate</label>
                  <input
                    type="number"
                    name="hourly_rate"
                    value={editData.hourly_rate || ""}
                    onChange={handleEditChange}
                  />
                </>
              )}

              {profile.role === "employer" && (
                <>
                  <label>Business Name</label>
                  <input
                    type="text"
                    name="business_name"
                    value={editData.business_name || ""}
                    onChange={handleEditChange}
                  />
                </>
              )}

              <label>Location</label>
              <input
                type="text"
                name="location"
                value={editData.location || ""}
                onChange={handleEditChange}
              />

              <div className="profile-edit-actions">
                <button type="button" onClick={cancelEditing} className="profile-cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="profile-save-btn" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>

        {isOwnProfile && !isEditing && (
          <button className="profile-edit-btn" onClick={startEditing}>Edit Profile</button>
        )}
      </div>

      {profile.bio && !isEditing && (
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