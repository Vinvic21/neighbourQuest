from extensions import db
from models import User, WorkerProfile, EmployerProfile


class UserController:

    @staticmethod
    def _resolve_profile_type(user, profile_type=None):
        # honor an explicit request only if the user actually has that profile
        if profile_type == "employer" and user.role in ("employer", "both"):
            return "employer"
        if profile_type == "worker" and user.role in ("worker", "both"):
            return "worker"

        # default: employer-only users get their employer profile,
        # everyone else (worker, or both with no explicit choice) gets worker
        if user.role == "employer":
            return "employer"
        return "worker"

    @staticmethod
    def get_user_profile(user_id, profile_type=None):
        user = User.query.get(user_id)
        if not user:
            return None, None

        resolved_type = UserController._resolve_profile_type(user, profile_type)

        if resolved_type == "employer":
            profile = EmployerProfile.query.filter_by(user_id=user_id).first()
            return profile, "employer"

        profile = WorkerProfile.query.filter_by(user_id=user_id).first()
        return profile, "worker"

    @staticmethod
    def update_user_profile(user_id, data, profile_type=None):
        user = User.query.get(user_id)
        if not user:
            return None, None

        resolved_type = UserController._resolve_profile_type(user, profile_type)

        if resolved_type == "employer":
            profile = EmployerProfile.query.filter_by(user_id=user_id).first()
            if not profile:
                return None, None

            user.phone = data.get("phone", user.phone)
            profile.business_name = data.get("business_name", profile.business_name)
            profile.location = data.get("location", profile.location)

            db.session.commit()
            return profile, "employer"

        # worker (or "both" defaulting/choosing worker) -> update WorkerProfile
        profile = WorkerProfile.query.filter_by(user_id=user_id).first()
        if not profile:
            return None, None

        user.phone = data.get("phone", user.phone)
        profile.skill_category = data.get("skill_category", profile.skill_category)
        profile.bio = data.get("bio", profile.bio)
        profile.hourly_rate = data.get("hourly_rate", profile.hourly_rate)
        profile.location = data.get("location", profile.location)

        db.session.commit()
        return profile, "worker"