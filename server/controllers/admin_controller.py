from extensions import db
from models import User, Job, Review


class AdminController:

    # ---------------- users ----------------
    @staticmethod
    def get_all_users():
        return User.query.all()

    @staticmethod
    def suspend_user(user_id):
        user = User.query.get(user_id)
        if not user:
            return None, "User not found"
        if user.is_admin:
            return None, "Cannot suspend an admin account"
        user.is_active = False
        db.session.commit()
        return user, None

    @staticmethod
    def reactivate_user(user_id):
        user = User.query.get(user_id)
        if not user:
            return None, "User not found"
        user.is_active = True
        db.session.commit()
        return user, None

    # ---------------- jobs ----------------
    @staticmethod
    def get_all_jobs():
        return Job.query.all()

    @staticmethod
    def delete_job(job_id):
        job = Job.query.get(job_id)
        if not job:
            return False, "Job not found"
        db.session.delete(job)
        db.session.commit()
        return True, None

    # ---------------- reviews ----------------
    @staticmethod
    def get_all_reviews():
        return Review.query.all()

    @staticmethod
    def delete_review(review_id):
        review = Review.query.get(review_id)
        if not review:
            return False, "Review not found"
        db.session.delete(review)
        db.session.commit()
        return True, None