from datetime import date, datetime, timedelta
from app import app
from extensions import db
from models import User, WorkerProfile, EmployerProfile, Job, Application, Review


def seed_database():
    with app.app_context():
        print("Dropping all tables...")
        db.drop_all()

        print("Creating all tables...")
        db.create_all()

        # ---------------- USERS ----------------
        print("Seeding users...")

        worker1 = User(
            name="David Kiptoo",
            email="david@example.com",
            phone="0712345678",
            role="worker",
        )
        worker1.set_password("password123")

        worker2 = User(
            name="Grace Njeri",
            email="grace@example.com",
            phone="0723456789",
            role="worker",
        )
        worker2.set_password("password123")

        worker3 = User(
            name="Samuel Otieno",
            email="samuel@example.com",
            phone="0734567890",
            role="worker",
        )
        worker3.set_password("password123")

        employer1 = User(
            name="Jane Wanjiru",
            email="jane@example.com",
            phone="0745678901",
            role="employer",
        )
        employer1.set_password("password123")

        employer2 = User(
            name="Peter Otieno",
            email="peter@example.com",
            phone="0756789012",
            role="employer",
        )
        employer2.set_password("password123")

        both_user = User(
            name="Amina Hassan",
            email="amina@example.com",
            phone="0767890123",
            role="both",
        )
        both_user.set_password("password123")

        db.session.add_all([worker1, worker2, worker3, employer1, employer2, both_user])
        db.session.commit()

        # ---------------- WORKER PROFILES (1:1 with User) ----------------
        print("Seeding worker profiles...")

        worker1_profile = WorkerProfile(
            user_id=worker1.id,
            skill_category="plumbing",
            bio="Experienced plumber with 6 years fixing residential leaks and installations.",
            hourly_rate=500,
            location="Nairobi",
            available=True,
        )

        worker2_profile = WorkerProfile(
            user_id=worker2.id,
            skill_category="cleaning",
            bio="Reliable house cleaner, available weekdays and weekends.",
            hourly_rate=300,
            location="Nairobi",
            available=True,
        )

        worker3_profile = WorkerProfile(
            user_id=worker3.id,
            skill_category="electrical",
            bio="Certified electrician specializing in home rewiring.",
            hourly_rate=700,
            location="Kisumu",
            available=False,
        )

        # "both" user also gets a worker profile
        both_worker_profile = WorkerProfile(
            user_id=both_user.id,
            skill_category="delivery",
            bio="Fast and reliable delivery rider, available all week.",
            hourly_rate=250,
            location="Mombasa",
            available=True,
        )

        db.session.add_all(
            [worker1_profile, worker2_profile, worker3_profile, both_worker_profile]
        )
        db.session.commit()

        # ---------------- EMPLOYER PROFILES (1:1 with User) ----------------
        print("Seeding employer profiles...")

        employer1_profile = EmployerProfile(
            user_id=employer1.id,
            business_name="Wanjiru Homes",
            location="Nairobi",
        )

        employer2_profile = EmployerProfile(
            user_id=employer2.id,
            business_name="Otieno Rentals",
            location="Kisumu",
        )

        # "both" user also gets an employer profile
        both_employer_profile = EmployerProfile(
            user_id=both_user.id,
            business_name="Hassan Enterprises",
            location="Mombasa",
        )

        db.session.add_all([employer1_profile, employer2_profile, both_employer_profile])
        db.session.commit()

        # ---------------- JOBS (1:N with EmployerProfile) ----------------
        print("Seeding jobs...")

        job1 = Job(
            employer_id=employer1_profile.id,
            title="Fix leaking kitchen pipe",
            description="Kitchen sink pipe is leaking under the counter, needs urgent repair.",
            category="plumbing",
            budget=2000,
            location="Nairobi",
            deadline=date.today() + timedelta(days=10),
            status="open",
        )

        job2 = Job(
            employer_id=employer2_profile.id,
            title="Paint two-bedroom apartment",
            description="Need interior walls painted, materials provided.",
            category="other",
            budget=8000,
            location="Kisumu",
            deadline=date.today() + timedelta(days=15),
            status="open",
        )

        job3 = Job(
            employer_id=employer1_profile.id,
            title="Rewire living room sockets",
            description="Two sockets sparking, need a certified electrician.",
            category="electrical",
            budget=3500,
            location="Nairobi",
            deadline=date.today() + timedelta(days=7),
            status="in_progress",
        )

        job4 = Job(
            employer_id=both_employer_profile.id,
            title="Move furniture to new apartment",
            description="Need help moving furniture across town, one truck load.",
            category="delivery",
            budget=1500,
            location="Mombasa",
            deadline=date.today() - timedelta(days=2),
            status="completed",
        )

        db.session.add_all([job1, job2, job3, job4])
        db.session.commit()

        # ---------------- APPLICATIONS (M:N between Worker and Job) ----------------
        print("Seeding applications...")

        application1 = Application(
            job_id=job2.id,
            worker_id=worker1_profile.id,
            status="applied",
        )

        application2 = Application(
            job_id=job3.id,
            worker_id=worker3_profile.id,
            status="accepted",
        )

        application3 = Application(
            job_id=job4.id,
            worker_id=both_worker_profile.id,
            status="accepted",
        )

        application4 = Application(
            job_id=job1.id,
            worker_id=worker1_profile.id,
            status="applied",
        )

        db.session.add_all([application1, application2, application3, application4])
        db.session.commit()

        # ---------------- REVIEWS (M:N between User and User, via Review) ----------------
        print("Seeding reviews...")

        review1 = Review(
            job_id=job4.id,
            reviewer_id=employer2.id,
            reviewee_id=both_user.id,
            rating=5,
            comment="Great work, arrived on time and handled everything carefully.",
        )

        review2 = Review(
            job_id=job4.id,
            reviewer_id=worker1.id,
            reviewee_id=employer1.id,
            rating=4,
            comment="Good communication throughout, would work with again.",
        )

        review3 = Review(
            job_id=job4.id,
            reviewer_id=employer1.id,
            reviewee_id=worker1.id,
            rating=5,
            comment="David fixed our pipe quickly and left everything clean. Highly recommend!",
        )

        db.session.add_all([review1, review2, review3])
        db.session.commit()

        print("Seeding complete!")
        print(f"  Users: {User.query.count()}")
        print(f"  Worker profiles: {WorkerProfile.query.count()}")
        print(f"  Employer profiles: {EmployerProfile.query.count()}")
        print(f"  Jobs: {Job.query.count()}")
        print(f"  Applications: {Application.query.count()}")
        print(f"  Reviews: {Review.query.count()}")


if __name__ == "__main__":
    seed_database()