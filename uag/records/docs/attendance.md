# How to Take Attendance

This guide explains how to record attendance for UAG sessions.

## Prerequisites

Before you begin, make sure you have:

- [ ] Git installed and configured on your computer (see [git.md](git.md) for setup instructions)
- [ ] A cloned copy of the records repository
- [ ] A text editor (VS Code recommended)

## Understanding Attendance Records

Each attendance record is a JSON file stored in the `records/attendance/` folder. The file contains:

- **session**: A unique identifier in the format `YYMMDD` (or `YYMMDD-#` if there are multiple sessions on the same day)
- **members**: A list of Discord user IDs for everyone who attended

## Step-by-Step Guide

### Step 1: Get the Latest Records

Open a terminal in your repository folder and run:

```bash
git pull
```

This ensures you have the most up-to-date version of the records.

### Step 2: Create a New Attendance File

1. Navigate to the `records/attendance/` folder
2. Create a new file named with the session date in `YYMMDD.json` format

**Example:** For a session on January 31st, 2026, create a file named `260131.json`

> **Note:** If there are multiple sessions on the same day, add a number suffix: `260131-2.json`, `260131-3.json`, etc.

### Step 3: Add the Attendance Data

Copy this template into your new file:

```json
{
  "$schema": "./_schema.json",
  "session": "YYMMDD",
  "members": ["discord_id_1", "discord_id_2", "discord_id_3"]
}
```

Then fill in the details:

1. Replace `YYMMDD` with the actual session date (e.g., `260131`)
2. Replace the example Discord IDs with the actual IDs of members who attended

### Step 4: Get Discord User IDs

To find someone's Discord user ID:

1. Open Discord
2. Go to **User Settings** → **Advanced** → Enable **Developer Mode**
3. Right-click on a user's name
4. Click **Copy User ID**

### Step 5: Save and Verify

1. Save your file
2. Make sure the JSON is valid:
   - All strings are in double quotes `"like this"`
   - Items in the array are separated by commas
   - No trailing comma after the last item

**Example of a completed attendance file (`260131.json`):**

```json
{
  "$schema": "./_schema.json",
  "session": "260131",
  "members": ["328938588127625216", "723361818940276736", "123456789012345678"]
}
```

### Step 6: Commit and Push Your Changes

Open a terminal in the repository folder and run these commands:

```bash
git add records/attendance/260131.json
git commit -m "Add attendance for session 260131"
git push
```

Replace `260131` with your actual session date.

## Quick Reference

| Field      | Format                           | Example                        |
| ---------- | -------------------------------- | ------------------------------ |
| Filename   | `YYMMDD.json` or `YYMMDD-#.json` | `260131.json`, `260131-2.json` |
| Session ID | `YYMMDD` or `YYMMDD-#`           | `260131`, `260131-2`           |
| Discord ID | 17-19 digit number as string     | `"328938588127625216"`         |

## Troubleshooting

### "Invalid JSON" Error

Common JSON mistakes:

- Missing quotes around strings
- Missing comma between array items
- Extra comma after the last item in the array
- Using single quotes instead of double quotes

### Git Push Fails

1. Make sure you've pulled the latest changes first: `git pull`
2. Check that you're authenticated properly
3. See [git.md](git.md) for more Git troubleshooting

### Multiple Sessions on Same Day

If you're recording a second (or third, etc.) session on the same day:

1. Name the file with a suffix: `260131-2.json`
2. Update the session field to match: `"session": "260131-2"`

## Questions?

If you're unsure about anything, ask a team member before submitting. It's better to ask than to submit incorrect records!
