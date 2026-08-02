from extensions import ma
from models.worker_profile import WorkerProfile
from models.review import Review


class WorkerProfileSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = WorkerProfile
        load_instance = True
        include_fk = True

    name = ma.Method("get_name")
    email = ma.Method("get_email")
    role = ma.Method("get_role")
    average_rating = ma.Method("get_average_rating")
    review_count = ma.Method("get_review_count")

    def get_name(self, obj):
        return obj.user.name if obj.user else None

    def get_email(self, obj):
        return obj.user.email if obj.user else None
    def get_role(self, obj):
        return obj.user.role if obj.user else None

    def _get_reviews(self, obj):
        if not obj.user:
            return []
        return Review.query.filter_by(reviewee_id=obj.user.id).all()

    def get_average_rating(self, obj):
        if hasattr(obj, "_average_rating"):
            return obj._average_rating
        reviews = self._get_reviews(obj)
        if not reviews:
            return 0
        return sum(review.rating for review in reviews) / len(reviews)

    def get_review_count(self, obj):
        if hasattr(obj, "_review_count"):
            return obj._review_count
        reviews = self._get_reviews(obj)
        return len(reviews)


worker_profile_schema = WorkerProfileSchema()
worker_profiles_schema = WorkerProfileSchema(many=True)