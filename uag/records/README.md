# records

> Publicly-auditable records of multiple types.

## Overview

This repository contains a collection of publicly-auditable records of various types. The records are organized in a structured format to facilitate easy access and verification. All records are maintained in a transparent manner to ensure their integrity and authenticity.

## Record Types

Each type of record is stored in its own directory along with relevant metadata files.

The following record types are included:

### [Attendance](records/attendance/)

Records of attendance for official UAG sessions.

Each record includes:

- Unique identifier for the session
- Array of attendees' Discord IDs

An example record for a session taking place on the 1st of February 2025 looks like this:

**250201.json**

```json
{
  "session": "250201",
  "members": ["76561198000000001", "76561198000000002", "76561198000000003"]
}
```

Another example record for a session taking place on the 15th of February 2025 and it's the second session of the day looks like this:

**250215-2.json**

```json
{
  "session": "250215-2",
  "members": ["76561198000000001", "76561198000000004"]
}
```

### [Reserves](records/reserves/)

Records of users who have volunteered to join the reserves for a specific period of time.

Each record includes:

- Discord ID of the member going into reserves
- Start date of the reserve period (YYMMDD)
- End date of the reserve period (YYMMDD)
- Reason for going into reserves
- Date a staff member was notified
- Discord ID of the staff member who approved the reserve request

An example record for a member going into reserves from the 1st of March 2025 to the 31st of March 2025 looks like this:

**76561198000000001_250301-250331.json**

```json
{
  "member": "76561198000000001",
  "start_date": "250301",
  "end_date": "250331",
  "reason": "Personal reasons.",
  "notified_on": "250225",
  "approved_by": "76561198000000099"
}
```
