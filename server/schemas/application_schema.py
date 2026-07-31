from extensions import ma
from models.application import Application


class ApplicationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Application
        load_instance = True
        include_fk = True


application_schema = ApplicationSchema()
applications_schema = ApplicationSchema(many=True)