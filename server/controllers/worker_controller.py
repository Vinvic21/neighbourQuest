from extensions import db
from models import WorkerProfile, Review
from sqlalchemy import func


class WorkerController:

    @staticmethod
    def get_all_workers():
        workers = WorkerProfile.query.all()
        WorkerController._attach_rating_stats(workers)
        return workers

    @staticmethod
    def get_worker_by_id(worker_id):
        worker = WorkerProfile.query.get(worker_id)
        if worker:
            WorkerController._attach_rating_stats([worker])
        return worker

    @staticmethod
    def _attach_rating_stats(workers):
        user_ids = [w.user_id for w in workers if w.user_id]
        if not user_ids:
            return

        stats = (
            db.session.query(
                Review.reviewee_id,
                func.avg(Review.rating),
                func.count(Review.id),
            )
            .filter(Review.reviewee_id.in_(user_ids))
            .group_by(Review.reviewee_id)
            .all()
        )
        stats_by_user_id = {
            user_id: (round(float(avg), 1), count) for user_id, avg, count in stats
        }

        for worker in workers:
            avg, count = stats_by_user_id.get(worker.user_id, (0, 0))
            worker._average_rating = avg
            worker._review_count = count