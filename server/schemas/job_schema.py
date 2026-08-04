from extensions import ma
from models.job import Job

class JobSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Job
        load_instance =True
        include_fk =True

    employerName = ma.Method("get_employer_name")
    employerPhone = ma.Method("get_employer_phone")

    def get_employer_name(self, obj):
        if obj.employer and obj.employer.user:
            return obj.employer.user.name
        return None

    def get_employer_phone(self, obj):
        if obj.employer and obj.employer.user:
            return obj.employer.user.phone
        return None

job_schema = JobSchema()
jobs_schema = JobSchema(many=True)