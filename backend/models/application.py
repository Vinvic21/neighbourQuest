from extensions import db
from datetime import datetime


class Application(db.Model):
    __tablename__ = "applications"

    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id"), nullable=False)
    worker_id = db.Column(db.Integer, db.ForeignKey("worker_profiles.id"), nullable=False)

    status = db.Column(db.String, default="applied")  
    applied_at = db.Column(db.DateTime, default=datetime.now)

    
    job = db.relationship("Job", back_populates="applications")
    worker = db.relationship("WorkerProfile", back_populates="applications")

    __table_args__ = (
        db.UniqueConstraint("job_id", "worker_id", name="unique_application_per_job"),
    )

    def __repr__(self):
        return f"<Application job={self.job_id} worker={self.worker_id}>"