from extensions import db


class EmployerProfile(db.Model):
    __tablename__ = "employer_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)

    business_name = db.Column(db.String(150))
    location = db.Column(db.String(100))

    # one to one
    user = db.relationship("User", back_populates="employer_profile")

    # one to many, employer can have many jobes
    jobs = db.relationship("Job", back_populates="employer", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<EmployerProfile {self.id} - user {self.user_id}>"