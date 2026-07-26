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