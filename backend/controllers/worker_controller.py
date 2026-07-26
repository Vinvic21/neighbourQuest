from models import WorkerProfile


class WorkerController:

    @staticmethod
    def get_all_workers():
        return WorkerProfile.query.all()

    @staticmethod
    def get_worker_by_id(worker_id):
        return WorkerProfile.query.get(worker_id)