import unittest
from src.utils.check_group_of_properties_exist import check_group_of_properties_exist


class TestCheckGroupOfPropertiesExist(unittest.TestCase):
    def test_all_exist(self):
        self.assertTrue(check_group_of_properties_exist(1, "a", 0, False, []))

    def test_one_none(self):
        self.assertFalse(check_group_of_properties_exist(1, None, "b"))

    def test_all_none(self):
        self.assertFalse(check_group_of_properties_exist(None, None))

    def test_empty(self):
        self.assertTrue(check_group_of_properties_exist())  # No args, so none are None

    def test_mixed_types(self):
        self.assertTrue(check_group_of_properties_exist(0, "", [], {}, False))
        self.assertFalse(check_group_of_properties_exist(0, "", None, {}, False))
