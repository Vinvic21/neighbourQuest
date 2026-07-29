from extensions import db
from datetime import datetime

class Job(db.Model):
    __tablename__="jobs"

    id =db.Column(db.Integer, primary_key=True)
    employer_id= db.Column(db.Integer, db.ForeignKey("employer_profiles.id"), nullable=False)

    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    budget = db.Column(db.Float)
    location = db.Column(db.String(100))
    deadline = db.Column(db.Date)
    status = db.Column(db.String(20), default="open")  #
    created_at = db.Column(db.DateTime, default=datetime.now)

    employer= db.relationship("EmployerProfile", back_populates="jobs")

    # many to many, job has many workers workers has many jobs

    applications = db.relationship("Application", back_populates= "job", cascade="all, delete-orphan" )

    # one to many, job many reviews
    reviews = db.relationship("Review", back_populates="job", cascade="all, delete-orphan" )

    def __repr__(self):
        return f"<Job {self.title}>"
