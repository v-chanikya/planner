import unittest
import json
import os

import jsonschema

from planner.db import *
from planner.utils import printer


class TestLoadAndSave(unittest.TestCase):
    MAIN_SCHEMA_FILE = "planner/schema.json"
    TEST_DATA_FILE = "tests/testdata.json"
    TEST_DATA_SAVE_FILE = "tests/tmp_file.json"
    def test_schema_file_syntax(self):
        with open(self.MAIN_SCHEMA_FILE,"r") as schema_file:
            self.assertIsNotNone(json.loads(schema_file.read()))
    
    def test_data_file_syntax(self):
        with open(self.TEST_DATA_FILE,"r") as data_file:
            self.assertIsNotNone(json.loads(data_file.read()))

    def test_if_data_follows_schema(self):
        with open(self.MAIN_SCHEMA_FILE,"r") as schema_file:
            schema = json.loads(schema_file.read())
        with open(self.TEST_DATA_FILE,"r") as data_file:
            data = json.loads(data_file.read())
        self.assertEqual(jsonschema.validate(data, schema), None)

    def test_if_objects_are_created(self):
        base_task, last_task_id = load_tasks_from_file(self.MAIN_SCHEMA_FILE, self.TEST_DATA_FILE)
        self.assertNotEqual(base_task, None)
        self.assertEqual(last_task_id, 100)

    def test_if_objects_are_saved_to_file(self):
        base_task, _ = load_tasks_from_file(self.MAIN_SCHEMA_FILE, self.TEST_DATA_FILE)
        self.assertEqual(save_to_file(base_task, self.TEST_DATA_SAVE_FILE), None)
        with open(self.MAIN_SCHEMA_FILE,"r") as schema_file:
            schema = json.loads(schema_file.read())
        with open(self.TEST_DATA_SAVE_FILE,"r") as data_file:
            data = json.loads(data_file.read())
        self.assertEqual(jsonschema.validate(data, schema), None)
        os.remove(self.TEST_DATA_SAVE_FILE)


if __name__ == '__main__':
    unittest.main()
