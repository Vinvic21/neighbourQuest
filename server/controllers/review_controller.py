from extensions import db
from models import Review


class ReviewController:

    @staticmethod
    def submit_review(reviewer_id, review_data):
        new_review = Review(
            job_id=review_data.get("jobId"),
            reviewer_id=reviewer_id,
            reviewee_id=review_data.get("revieweeId"),
            rating=review_data.get("rating"),
            comment=review_data.get("comment"),
        )
        db.session.add(new_review)
        db.session.commit()
        return new_review
    # all reviews about a user
    @staticmethod
    def get_reviews_for_user(user_id):
        return Review.query.filter_by(reviewee_id=user_id).all()