from extensions import db
from datetime import datetime
from models import Job, EmployerProfile


class JobController:

    @staticmethod
    def get_all_jobs():
        return Job.query.all()

    @staticmethod
    def get_job_by_id(job_id):
        return Job.query.get(job_id)

    @staticmethod
    def get_jobs_by_employer(user_id):
        employer_profile = EmployerProfile.query.filter_by(user_id=user_id).first()
        if not employer_profile:
            return None
        return Job.query.filter_by(employer_id=employer_profile.id).all()

    @staticmethod
    def create_job(user_id, job_data):
        employer_profile = EmployerProfile.query.filter_by(user_id=user_id).first()
        if not employer_profile:
            return None
        deadline_str = job_data.get("deadline")
        deadline_date = None
        if deadline_str:
            deadline_date = datetime.strptime(deadline_str, "%Y-%m-%d").date()

        new_job = Job(
            employer_id=employer_profile.id,
            title=job_data.get("title"),
            description=job_data.get("description"),
            category=job_data.get("category"),
            budget=job_data.get("budget"),
            location=job_data.get("location"),
            deadline= deadline_date,
        )
        db.session.add(new_job)
        db.session.commit()
        return new_job

    @staticmethod
    def update_job_status(job_id, status):
        job = Job.query.get(job_id)
        if not job:
            return None
        job.status = status
        db.session.commit()
        return job