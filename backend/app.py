from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db, ma, jwt
from models import User, WorkerProfile, EmployerProfile, Job, Application, Review
from schemas import user_schema, users_schema, worker_profile_schema, worker_profiles_schema, employer_profile_schema, employer_profiles_schema, job_schema, jobs_schema, application_schema,applications_schema, review_schema, reviews_schema
from controllers import AuthController, JobController, WorkerController, ApplicationController, ReviewController, UserController


app =Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///neighborquest"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "victorkipngeno"

db.init_app(app)
ma.init_app(app)
jwt.init_app(app)

migrate = Migrate(app, db)

@app.route("/")
def home():
    return jsonify({"message": "welcome to neighborquest"})

@app.route("/auth/register", methods=["POST"])
def register():
    pass


@app.route("/auth/login", methods=["POST"])
def login():
    pass

@app.route("/jobs")
def get_jobs():
    pass

@app.route("/jobs", methods=["POST"])
@jwt_required()
def create_job():
    pass

@app.route("/jobs/employer/<int:user_id>")
@jwt_required()
def get_jobs_by_employer(user_id):
    pass

@app.route("/jobs/<int:job_id>/status", methods=["PATCH"])
@jwt_required()
def update_job_status(job_id):
    pass

app.route("/jobs/<int:job_id>/apply", methods=["POST"])
@jwt_required()
def apply_to_job(job_id):
    pass


@app.route("/jobs/<int:job_id>/applications")
@jwt_required()
def get_applications_for_job(job_id):
    pass

@app.route("/applications/me")
@jwt_required()
def get_my_applications():
    pass

@app.route("/applications/<int:application_id>", methods=["PATCH"])
@jwt_required()
def update_application_status(application_id):
    pass

@app.route("/workers")
def get_workers():
    pass

@app.route("/workers/<int:worker_id>")
def get_worker(worker_id):
    pass

@app.route("/users/<int:user_id>")
def get_user_profile(user_id):
    pass

@app.route("/reviews", methods=["POST"])
@jwt_required()
def submit_review():
    pass

@app.route("/reviews/user/<int:user_id>")
def get_reviews_for_user(user_id):
    pass

if __name__ == "__main__":
    app.run(debug=True, port=5000)

