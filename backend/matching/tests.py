from types import SimpleNamespace

from django.contrib.auth.models import User
from django.test import SimpleTestCase, TestCase

from jobs.models import Job
from matching.models import MatchResult
from matching.serializers import MatchResultSerializer
from matching.services.matcher import calculate_skill_match
from resumes.models import Resume


class SkillMatchingTests(SimpleTestCase):
    def test_required_and_preferred_skills_are_classified_separately(self):
        resume = SimpleNamespace(
            skills=SimpleNamespace(
                all=lambda: [SimpleNamespace(name="python")]
            )
        )
        job = SimpleNamespace(
            skills=SimpleNamespace(
                all=lambda: [
                    SimpleNamespace(name="Python", importance="preferred"),
                    SimpleNamespace(name="Django", importance="required"),
                ]
            )
        )

        result = calculate_skill_match(resume, job)

        self.assertEqual(result["matched_preferred_skills"], ["python"])
        self.assertEqual(result["missing_required_skills"], ["django"])
        self.assertEqual(result["matched_required_skills"], [])
        self.assertEqual(result["score"], 50.0)


class MatchResultSerializerTests(TestCase):
    def test_result_includes_job_and_resume_labels(self):
        user = User.objects.create_user(username="match-label-user")
        resume = Resume.objects.create(
            user=user,
            title="Backend Engineer Resume",
            file="resumes/backend.pdf",
        )
        job = Job.objects.create(
            user=user,
            title="Python Engineer",
            company="Example Corp",
            description="Build APIs with Python.",
        )
        result = MatchResult.objects.create(
            user=user,
            resume=resume,
            job=job,
        )

        data = MatchResultSerializer(result).data

        self.assertEqual(data["resume_title"], "Backend Engineer Resume")
        self.assertEqual(data["job_title"], "Python Engineer")
        self.assertEqual(data["company"], "Example Corp")
