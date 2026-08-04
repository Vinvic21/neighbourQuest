from extensions import ma
from models.employer_profile import EmployerProfile
from models.review import Review


class EmployerProfileSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = EmployerProfile
        load_instance = True
        include_fk = True

    name = ma.Method("get_name")
    email = ma.Method("get_email")
    phone = ma.Method("get_phone")
    role = ma.Method("get_role")
    average_rating = ma.Method("get_average_rating")
    review_count = ma.Method("get_review_count")

    def get_name(self, obj):
        return obj.user.name if obj.user else None

    def get_email(self, obj):
        return obj.user.email if obj.user else None

    def get_phone(self, obj):
        return obj.user.phone if obj.user else None

    def get_role(self, obj):
        return obj.user.role if obj.user else None

    def _get_reviews(self, obj):
        if not obj.user:
            return []
        return Review.query.filter_by(reviewee_id=obj.user.id).all()

    def get_average_rating(self, obj):
        reviews = self._get_reviews(obj)
        if not reviews:
            return 0
        return round(sum(r.rating for r in reviews) / len(reviews), 1)

    def get_review_count(self, obj):
        return len(self._get_reviews(obj))


employer_profile_schema = EmployerProfileSchema()
employer_profiles_schema = EmployerProfileSchema(many=True)