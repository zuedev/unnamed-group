# Git Setup Guide

This guide will help you install and configure Git so you can contribute to the records repository.

## What is Git?

Git is a version control system that tracks changes to files. It allows multiple people to work on the same project without overwriting each other's work, and keeps a complete history of all changes.

## Installing Git

### Windows

1. Download the Git installer from [git-scm.com](https://git-scm.com/download/win)
2. Run the downloaded `.exe` file
3. Follow the installation wizard:
   - Accept the license agreement
   - Use the default installation location (or choose your own)
   - **Important settings to note:**
     - Select "Git from the command line and also from 3rd-party software"
     - Select "Use Visual Studio Code as Git's default editor" (if you have VS Code)
     - Select "Override the default branch name" and set it to `main`
     - Keep other settings as default
4. Click **Install** and wait for it to complete
5. Click **Finish**

### Verify Installation

Open a terminal (Command Prompt, PowerShell, or VS Code terminal) and run:

```bash
git --version
```

You should see something like `git version 2.x.x`.

## First-Time Git Configuration

Before you can use Git, you need to tell it who you are. Run these commands in your terminal (replace with your actual information):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Cloning the Repository

"Cloning" means downloading a copy of the repository to your computer.

1. Open a terminal
2. Navigate to where you want to store the project:
   ```bash
   cd C:\Users\YourName\Documents
   ```
3. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
4. Enter the project folder:
   ```bash
   cd records
   ```

## Basic Git Workflow

Here's the typical workflow when making changes:

### 1. Check Your Status

See what files have changed:

```bash
git status
```

### 2. Pull Latest Changes

Before making changes, always get the latest version:

```bash
git pull
```

### 3. Make Your Changes

Edit or create files as needed (see [attendance.md](attendance.md) for attendance-specific instructions).

### 4. Stage Your Changes

Tell Git which files you want to include in your commit:

```bash
# Add a specific file
git add records/attendance/260131.json

# Or add all changed files
git add .
```

### 5. Commit Your Changes

Save your changes with a descriptive message:

```bash
git commit -m "Add attendance for session 260131"
```

### 6. Push Your Changes

Upload your changes to the remote repository:

```bash
git push
```

## Common Issues

### "Permission denied" or Authentication Errors

You may need to set up authentication. The easiest way is:

1. When prompted, enter your username
2. For the password, you'll likely need a **Personal Access Token** instead of your actual password
   - Check your Git hosting platform's documentation for creating tokens

### "Please tell me who you are"

Run the configuration commands from the [First-Time Git Configuration](#first-time-git-configuration) section.

### Merge Conflicts

If someone else changed the same file you did:

1. Git will tell you there's a conflict
2. Open the conflicting file and look for markers like `<<<<<<< HEAD`
3. Edit the file to resolve the conflict
4. Save, then `git add` and `git commit` the resolved file

## Need More Help?

- [Official Git Documentation](https://git-scm.com/doc)
- [GitHub's Git Guides](https://github.com/git-guides)
- Ask a team member for assistance
