from extensions import db

class WorkerProfile(db.Model):
    __tablename__ ="worker_profiles"

    id =db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)
    skill_category = db.Column(db.String(50))
    bio = db.Column(db.Text)
    hourly_rate = db.Column(db.Float)
    location = db.Column(db.String(100))
    available = db.Column(db.Boolean, default=True)

    # one to one rell
    user = db.relationship("User", back_populates="worker_profile")

    # many to many rel
    applications = db.relationship("Application", back_populates="worker", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<WorkerProfile {self.id} - user {self.user_id}>"