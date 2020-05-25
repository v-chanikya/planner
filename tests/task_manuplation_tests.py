import unittest

from planner.Task import *
from planner.db import *

class TestTaskManuplation(unittest.TestCase):
    TEST_DATA_FILE = "tests/testdata.json"
    MAIN_SCHEMA_FILE = "planner/schema.json"

    def test_task_creation(self):
        ROOT_DATA.base_task, ROOT_DATA.last_task_id = load_tasks_from_file(self.MAIN_SCHEMA_FILE,self.TEST_DATA_FILE)
        self.assertEqual(create_task(2, "Test task", "this is a test task"), None)
        self.assertEqual(save_to_file(ROOT_DATA.base_task, "tests/tmp_data.json"),None)


if __name__ == "__main__":
    unittest.main()
