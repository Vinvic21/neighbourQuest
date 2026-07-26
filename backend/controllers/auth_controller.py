from extensions import db
from models import User


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
        return new_user


    @staticmethod
    def authenticate_user(email, password):
        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):
            return user

        return None