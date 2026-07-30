from extensions import db
from models import User, WorkerProfile, EmployerProfile


class UserController:

    @staticmethod
    def get_user_profile(user_id):
       
        user = User.query.get(user_id)
        if not user:
            return None, None

        if user.role == "employer":
            profile = EmployerProfile.query.filter_by(user_id=user_id).first()
            return profile, "employer"

        # if role is worker or both returns WorkerProfile
        profile = WorkerProfile.query.filter_by(user_id=user_id).first()
        return profile, "worker"

    @staticmethod
    def update_user_profile(user_id, data):
        user = User.query.get(user_id)
        if not user:
            return None, None

        if user.role == "employer":
            profile = EmployerProfile.query.filter_by(user_id=user_id).first()
            if not profile:
                return None, None

            profile.business_name = data.get("business_name", profile.business_name)
            profile.location = data.get("location", profile.location)

            db.session.commit()
            return profile, "employer"

        # worker or both -> update WorkerProfile
        profile = WorkerProfile.query.filter_by(user_id=user_id).first()
        if not profile:
            return None, None

        profile.skill_category = data.get("skillCategory", profile.skill_category)
        profile.bio = data.get("bio", profile.bio)
        profile.hourly_rate = data.get("hourlyRate", profile.hourly_rate)
        profile.location = data.get("location", profile.location)

        db.session.commit()
        return profile, "worker"