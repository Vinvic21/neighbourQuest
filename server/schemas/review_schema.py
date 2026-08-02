from extensions import ma
from models.review import Review


class ReviewSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Review
        load_instance = True
        include_fk = True

    reviewerName = ma.Method("get_reviewer_name")
    createdAt = ma.Method("get_created_at")

    def get_reviewer_name(self, obj):   
        return obj.reviewer.name if obj.reviewer else None

    def get_created_at(self, obj):
        return obj.created_at.isoformat() if obj.created_at else None


review_schema = ReviewSchema()
reviews_schema = ReviewSchema(many=True)