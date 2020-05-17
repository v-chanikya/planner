import json
import jsonschema
import argparse


def main():
    with open("schema.json","r") as schema_file:
        tasks_schema = json.loads(schema_file.read())
    with open("tasks.json","r") as tasks_file:
        tasks = json.loads(tasks_file.read())
    jsonschema.validate(tasks, tasks_schema)

if __name__ == "__main__":
    main()

