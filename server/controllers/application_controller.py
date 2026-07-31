from extensions import db
from models import Application, WorkerProfile


class ApplicationController:

    @staticmethod
    def apply_to_job(user_id, job_id):
        worker_profile = WorkerProfile.query.filter_by(user_id=user_id).first()
        if not worker_profile:
            return None
        # pvevents worker applying job multiple times
        existing = Application.query.filter_by(job_id=job_id, worker_id=worker_profile.id).first()
        if existing:
            return None

        new_application = Application(job_id=job_id, worker_id=worker_profile.id)
        db.session.add(new_application)
        db.session.commit()
        return new_application

    @staticmethod
    def get_applications_for_job(job_id):
        return Application.query.filter_by(job_id=job_id).all()

    @staticmethod
    def get_applications_for_worker(user_id):
        worker_profile = WorkerProfile.query.filter_by(user_id=user_id).first()
        if not worker_profile:
            return None
        # all applications for a user
        return Application.query.filter_by(worker_id=worker_profile.id).all()


# update status of application, applied accepted or jejected
    @staticmethod
    def update_status(application_id, status):
        application = Application.query.get(application_id)
        if not application:
            return None
        application.status = status
        db.session.commit()
        return application