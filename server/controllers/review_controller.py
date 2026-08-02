from extensions import db
from models import Review, Job


class ReviewController:

    @staticmethod
    def submit_review(reviewer_id, review_data):
        job_id = review_data.get("jobId")
        reviewee_id = review_data.get("revieweeId")
        rating = review_data.get("rating")

        if not job_id or not reviewee_id or not rating:
            return None, "jobId, revieweeId and rating are required"

        job = Job.query.get(job_id)
        if not job:
            return None, "Job not found"

        reviewer_id = int(reviewer_id)
        reviewee_id = int(reviewee_id)

        employer_user_id = job.employer.user_id if job.employer else None
        accepted_worker_user_ids = [
            application.worker.user_id
            for application in job.applications
            if application.status == "accepted" and application.worker
        ]

        is_employer_reviewing_worker = (
            reviewer_id == employer_user_id and reviewee_id in accepted_worker_user_ids
        )
        is_worker_reviewing_employer = (
            reviewer_id in accepted_worker_user_ids and reviewee_id == employer_user_id
        )

        if not (is_employer_reviewing_worker or is_worker_reviewing_employer):
            return None, "You can only review someone you worked with on this job"

        if job.status != "completed":
            return None, "This job hasn't been marked as completed yet"

        existing = Review.query.filter_by(
            job_id=job_id, reviewer_id=reviewer_id, reviewee_id=reviewee_id
        ).first()
        if existing:
            return None, "You have already reviewed this person for this job"

        new_review = Review(
            job_id=job_id,
            reviewer_id=reviewer_id,
            reviewee_id=reviewee_id,
            rating=rating,
            comment=review_data.get("comment"),
        )
        db.session.add(new_review)
        db.session.commit()
        return new_review, None

    # all reviews about a user
    @staticmethod
    def get_reviews_for_user(user_id):
        return Review.query.filter_by(reviewee_id=user_id).all()