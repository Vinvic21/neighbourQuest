from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from extensions import db, ma, jwt
from models import User, WorkerProfile, EmployerProfile, Job, Application, Review
from schemas import user_schema, users_schema, worker_profile_schema, worker_profiles_schema, employer_profile_schema, employer_profiles_schema, job_schema, jobs_schema, application_schema,applications_schema, review_schema, reviews_schema
from controllers import AuthController, JobController, WorkerController, ApplicationController, ReviewController, UserController
import os
import re


app =Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173",
    re.compile(r"https://neighbour-quest.*\.vercel\.app"),
])

# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///neighborquest.db"
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL","sqlite:///neighborquest.db").replace("postgres://", "postgresql://", 1)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "victorkipngeno")

db.init_app(app)
ma.init_app(app)
jwt.init_app(app)

migrate = Migrate(app, db)
with app.app_context():
    db.create_all()


@app.route("/")
def home():
    return jsonify({"message": "welcome to neighborquest"})

@app.route("/auth/register", methods=["POST"])
def register():
    user_data = request.json
    new_user = AuthController.register_user(user_data)
    if new_user:
        return jsonify({"message": "User registered successfully"}), 201
    return jsonify({"message": "Registration failed"}), 400
        



@app.route("/auth/login", methods=["POST"])
def login():
    data = request.json
    user = AuthController.authenticate_user(email=data.get("email"), password=data.get("password"))

    if user:
        token = create_access_token(identity=str(user.id),additional_claims={"name": user.name, "email": user.email, "role":user.role},)

        return jsonify({
            "token": token,
            "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role},
        }), 200
    return jsonify({"message": "Invalid email or password"})

# get all jobs 

@app.route("/jobs")
def get_jobs():
    jobs = JobController.get_all_jobs()
    return  jsonify(jobs_schema.dump(jobs))

@app.route("/jobs/<int:job_id>")
def get_job(job_id):
    job = JobController.get_job_by_id(job_id)
    if job:
        return jsonify(job_schema.dump(job))
    return jsonify({"message": "No job found"}),404

@app.route("/jobs", methods=["POST"])
@jwt_required()
def create_job():
    user_id = get_jwt_identity()
    new_job = JobController.create_job(user_id, request.json)
    if new_job:
        return jsonify(job_schema.dump(new_job)),201
    return jsonify({"message": "Only employers can create jobs"}), 403
    

@app.route("/jobs/employer/<int:user_id>")
@jwt_required()
def get_jobs_by_employer(user_id):
   jobs = JobController.get_jobs_by_employer(user_id)
   if jobs is None:
       return jsonify({"error": "Employer profile not found"}), 404

   return jsonify(jobs_schema.dump(jobs))


@app.route("/jobs/<int:job_id>/status", methods=["PATCH"])
@jwt_required()
def update_job_status(job_id):
    status = request.json.get("status")
    job = JobController.update_job_status(job_id, status)
    if job:
        return jsonify(job_schema.dump(job))
    return jsonify({"error": "Job not found"}), 404

# apllication routess

@app.route("/jobs/<int:job_id>/apply", methods=["POST"])
@jwt_required()
def apply_to_job(job_id):
    user_id = get_jwt_identity()
    apllication = ApplicationController.apply_to_job(user_id, job_id)
    if apllication:
        return jsonify(application_schema.dump(apllication)), 201

    return jsonify({"error": "Unable to apply. You may have already applied."}), 400


@app.route("/jobs/<int:job_id>/applications")
@jwt_required()
def get_applications_for_job(job_id):
    applications = ApplicationController.get_applications_for_job(job_id)
    return jsonify(applications_schema.dump(applications))

@app.route("/applications/me")
@jwt_required()
def get_my_applications():
    user_id = get_jwt_identity()
    applications = ApplicationController.get_applications_for_worker(user_id)
    if applications is None:
        return jsonify({"error": "Worker profile not found"}), 404
    return jsonify(applications_schema.dump(applications))
    

@app.route("/applications/<int:application_id>", methods=["PATCH"])
@jwt_required()
def update_application_status(application_id):
    status = request.json.get("status")
    application = ApplicationController.update_status(application_id, status)

    if application :
        return jsonify(applications_schema.dump(application))
    return jsonify ({"error": "Application not found"}), 404

# workeres, geting workers
@app.route("/workers")
def get_workers():
    workers = WorkerController.get_all_workers()
    return jsonify(worker_profiles_schema.dump(workers))

@app.route("/workers/<int:worker_id>")
def get_worker(worker_id):
    worker = WorkerController.get_worker_by_id(worker_id)
    if worker:
        return jsonify(worker_profile_schema.dump(worker))
    return jsonify({"error": "Worker not found"}), 404


# profiless

@app.route("/users/<int:user_id>")
def get_user_profile(user_id):
    profile, profile_type = UserController.get_user_profile(user_id)

    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    if profile_type == "employer":
        return jsonify(employer_profile_schema.dump(profile))

    return jsonify(worker_profile_schema.dump(profile))

@app.route("/users/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user_profile(user_id):
    profile, profile_type = UserController.update_user_profile(user_id, request.json)

    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    if profile_type == "employer":
        return jsonify(employer_profile_schema.dump(profile))

    return jsonify(worker_profile_schema.dump(profile))

# reviews
@app.route("/reviews", methods=["POST"])
@jwt_required()
def submit_review():
    reviewer_id = get_jwt_identity()
    new_review = ReviewController.submit_review(reviewer_id, request.json)
    return jsonify(review_schema.dump(new_review)), 201


@app.route("/reviews/user/<int:user_id>")
def get_reviews_for_user(user_id):
    reviews = ReviewController.get_reviews_for_user(user_id)
    return jsonify(reviews_schema.dump(reviews))

if __name__ == "__main__":
    app.run(debug=True, port=5000)

