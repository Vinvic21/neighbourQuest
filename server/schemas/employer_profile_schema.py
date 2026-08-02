from extensions import ma
from models.employer_profile import EmployerProfile


class EmployerProfileSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = EmployerProfile
        load_instance = True
        include_fk = True

    name = ma.Method("get_name")
    email = ma.Method("get_email")
    role = ma.Method("get_role")

    def get_name(self, obj):
        return obj.user.name if obj.user else None
    def get_email(self, obj):
        return obj.user.email if obj.user else None
    def get_role(self, obj):
        return obj.user.role if obj.user else None


employer_profile_schema = EmployerProfileSchema()
employer_profiles_schema = EmployerProfileSchema(many=True)