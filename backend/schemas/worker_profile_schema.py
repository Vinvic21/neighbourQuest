from extensions import ma
from models.worker_profile import WorkerProfile


class WorkerProfileSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = WorkerProfile
        load_instance = True
        include_fk = True


worker_profile_schema = WorkerProfileSchema()
worker_profiles_schema = WorkerProfileSchema(many=True)