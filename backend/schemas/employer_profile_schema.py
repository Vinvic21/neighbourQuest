from extensions import ma
from models.employer_profile import EmployerProfile


class EmployerProfileSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = EmployerProfile
        load_instance = True
        include_fk = True


employer_profile_schema = EmployerProfileSchema()
employer_profiles_schema = EmployerProfileSchema(many=True)