from unittest.mock import patch

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from jobs.models import Job, JobSkill


class JobCreationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="job-creation-user")
        self.client.force_authenticate(user=self.user)
        self.url = "/api/jobs/"

    def test_creation_rejects_negative_required_experience(self):
        with patch("jobs.views.analyze_job_description") as analyze:
            response = self.client.post(
                self.url,
                {
                    "title": "Python Developer",
                    "description": "Build APIs with Python.",
                    "required_experience_years": -1,
                },
                format="json",
            )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Job.objects.count(), 0)
        analyze.assert_not_called()

    def test_creation_saves_validated_job_and_analyzed_skills(self):
        analysis = {
            "skills": [
                {
                    "name": "python",
                    "category": "programming",
                    "confidence": 1.0,
                    "importance": "preferred",
                }
            ]
        }
        with patch(
            "jobs.views.analyze_job_description",
            return_value=analysis,
        ):
            response = self.client.post(
                self.url,
                {
                    "title": "  Python Developer  ",
                    "description": " Build APIs with Python. ",
                    "required_experience_years": "2.5",
                },
                format="json",
            )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["data"]["title"], "Python Developer")
        self.assertEqual(response.data["data"]["description"], "Build APIs with Python.")
        self.assertEqual(Job.objects.count(), 1)
        self.assertEqual(JobSkill.objects.get().importance, "preferred")
