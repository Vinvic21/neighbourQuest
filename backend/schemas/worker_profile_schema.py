from extensions import ma
from models.worker_profile import WorkerProfile


class WorkerProfileSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = WorkerProfile
        load_instance = True
        include_fk = True

    name = ma.Method("get_name")
    email = ma.Method("get_email")

    def get_name(self, obj):
        return obj.user.name if obj.user else None

    def get_email(self, obj):
        return obj.user.email if obj.user else None


worker_profile_schema = WorkerProfileSchema()
worker_profiles_schema = WorkerProfileSchema(many=True)