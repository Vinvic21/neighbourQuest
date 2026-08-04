from extensions import db
from models import User, WorkerProfile, EmployerProfile


class AuthController:
    @staticmethod
    def register_user(user_data):
        email= user_data.get("email")

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return None
        new_user= User(
            name= user_data.get("name"),
            email= email,
            phone = user_data.get("phone"),
            role= user_data.get("role", "worker"),
        )
        new_user.set_password(user_data.get("password"))


        db.session.add(new_user)
        db.session.commit()
        if new_user.role in ("worker","both"):
            worker_profile = WorkerProfile(
                user_id=new_user.id,
                skill_category=user_data.get("skill_category", ""),
                location=user_data.get("location", ""),
            )
            db.session.add(worker_profile)

        if new_user.role in ("employer", "both"):
            employer_profile = EmployerProfile(
                user_id=new_user.id,
                business_name=user_data.get("business_name", ""),
                location=user_data.get("location", ""),
            )
            db.session.add(employer_profile)
        db.session.commit()
        return new_user


    @staticmethod
    def authenticate_user(email, password):
        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            return None, "Invalid email or password"

        if not user.is_active:
            return None, "This account has been suspended. Contact support for help."

        return user, None