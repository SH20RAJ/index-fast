import csv
import sys
import os
import time

# To be called with: python3 execute_outreach.py <start_index> <batch_size>
# Indices are 0-based relative to the CSV rows (excluding header)

DRY_RUN_CSV = "/Users/shaswatraj/Desktop/indexfast/outreach/outreach-v2-dryrun.csv"
LOG_FILE = "/Users/shaswatraj/Desktop/indexfast/outreach/outreach-log-v2.csv"

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 execute_outreach.py <start_index> <batch_size>")
        return

    start_idx = int(sys.argv[1])
    batch_size = int(sys.argv[2])

    if not os.path.exists(DRY_RUN_CSV):
        print("Dry run CSV not found.")
        return

    with open(DRY_RUN_CSV, "r", encoding="utf-8") as f:
        reader = list(csv.DictReader(f))
        
    batch = reader[start_idx : start_idx + batch_size]
    
    if not batch:
        print("No more prospects in this range.")
        return

    print(f"Executing batch: {start_idx} to {start_idx + len(batch)}")
    
    # We will print the commands to be run or use the tool directly if in a loop.
    # Since I am the agent, I will call the tool in a loop in my thought process.
    # For now, this script just identifies the batch.
    
    for row in batch:
        print(f"ID: {start_idx + batch.index(row)} | To: {row['to']} | Subject: {row['subject']}")

if __name__ == "__main__":
    main()
