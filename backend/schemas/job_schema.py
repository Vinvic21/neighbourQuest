from extensions import ma
from models.job import Job

class JobSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Job
        load_instance =True
        include_fk =True

job_schema = JobSchema()
jobs_schema = JobSchema(many=True)