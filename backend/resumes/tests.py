from django.test import SimpleTestCase

from resumes.services.skill_extractor import skill_exists


class SkillExtractorTests(SimpleTestCase):
    def test_skill_detection_respects_word_boundaries(self):
        self.assertTrue(skill_exists("Experienced in JavaScript", "javascript"))
        self.assertFalse(skill_exists("Experienced in JavaScript", "java"))
        self.assertFalse(skill_exists("PostgreSQL and NoSQL", "sql"))
        self.assertFalse(skill_exists("React developer", "c"))
        self.assertTrue(skill_exists("C++ developer", "c++"))
