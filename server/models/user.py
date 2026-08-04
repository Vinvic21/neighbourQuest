from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String, nullable=False)
    role = db.Column(db.String(20), nullable=False, default="worker")  
    is_admin = db.Column(db.Boolean, nullable=False, default=False)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, default=datetime.now)

    # one to one rel
    worker_profile = db.relationship("WorkerProfile", back_populates ="user", uselist = False, cascade= "all, delete-orphan")
    employer_profile= db.relationship("EmployerProfile", back_populates= "user", uselist=False, cascade="all, delete-orphan")

    # many to many rel
    reviews_written = db.relationship("Review", foreign_keys="Review.reviewer_id", back_populates="reviewer")
    reviews_received = db.relationship("Review", foreign_keys="Review.reviewee_id", back_populates="reviewee")

    # this will hash the passwoord
    def set_password(self, raw_password):
        self.password_hash = generate_password_hash(raw_password)
    # compares the hash password with password entered
    def check_password(self, raw_password):
        return check_password_hash(self.password_hash, raw_password)

    def __repr__(self):
        return f"<User {self.name, self.email}>"