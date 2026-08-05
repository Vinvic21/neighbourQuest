from extensions import ma
from models.application import Application


class ApplicationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Application
        load_instance = True
        include_fk = True

    #  joined fields the frontend dashboard relies on
    jobId = ma.Method("get_job_id")
    jobTitle = ma.Method("get_job_title")
    jobStatus = ma.Method("get_job_status")
    employerId = ma.Method("get_employer_id")     # employer's User.id, for submitting a review
    employerName = ma.Method("get_employer_name")
    employerPhone = ma.Method("get_employer_phone")
    workerId = ma.Method("get_worker_id")         # worker's User.id, for submitting a review
    workerName = ma.Method("get_worker_name")
    workerPhone = ma.Method("get_worker_phone")

    def get_job_id(self, obj):
        return obj.job.id if obj.job else None

    def get_job_title(self, obj):
        return obj.job.title if obj.job else None

    def get_job_status(self, obj):
        return obj.job.status if obj.job else None

    def get_employer_id(self, obj):
        if obj.job and obj.job.employer and obj.job.employer.user:
            return obj.job.employer.user.id
        return None

    def get_employer_name(self, obj):
        if obj.job and obj.job.employer and obj.job.employer.user:
            return obj.job.employer.user.name
        return None

    def get_employer_phone(self, obj):
        if obj.job and obj.job.employer and obj.job.employer.user:
            return obj.job.employer.user.phone
        return None

    def get_worker_id(self, obj):
        if obj.worker and obj.worker.user:
            return obj.worker.user.id
        return None

    def get_worker_name(self, obj):
        if obj.worker and obj.worker.user:
            return obj.worker.user.name
        return None

    def get_worker_phone(self, obj):
        if obj.worker and obj.worker.user:
            return obj.worker.user.phone
        return None


application_schema = ApplicationSchema()
applications_schema = ApplicationSchema(many=True)