# Copilot Instructions for AI Coding Agents

## Project Overview
This codebase is a hybrid web application and Python backend for faculty management, credential handling, and database operations. It includes HTML/JS frontend files, Python scripts for data processing, and a server component. The structure is nested, with repeated subfolders for different deployment instances.

## Architecture & Structure
- **Frontend:** HTML and JS files (e.g., `add-faculty.html`, `dashboard.html`, `profile.html`) paired with corresponding `*-app.js` files for UI logic.
- **Backend:** Python scripts for database operations, data cleaning, and diagnostics (e.g., `check_db.py`, `fix_db.py`, `server.py`).
- **Instances:** Deeply nested `instance/` and `new fd/` folders contain copies of the app for different environments or deployments.
- **Components:** Shared JS components in `components/` (e.g., `Layout.js`).
- **Assets:** Static files in `assets/`.
- **Utils:** Utility scripts in `utils/`.

## Developer Workflows
- **Run Backend:** Use `server.py` to start the backend server. Ensure Python dependencies from `requirements.txt` are installed.
- **Frontend Development:** Edit HTML/JS files directly. No build step required; changes are reflected immediately.
- **Testing:** Test scripts like `test_add_faculty.py` and `test_update_api.py` are used for backend validation. Run with Python.
- **Database Management:** Scripts like `init_fresh_db.py`, `recreate_db_complete.py`, and `fix_db.py` are used for DB setup and repair.

## Project-Specific Patterns
- **File Pairing:** Each major feature has paired HTML and JS files (e.g., `faculty-list.html` + `faculty-list-app.js`).
- **Script Naming:** Python scripts are named for their function (e.g., `check_*`, `fix_*`, `inspect_*`).
- **Instance Duplication:** Multiple nested folders (`instance/`, `new fd/`) contain nearly identical app copies. Always check which instance is active.
- **Minimal Frameworks:** No frontend frameworks; pure JS and HTML. Backend is plain Python.

## Integration & Dependencies
- **Python:** Install dependencies via `requirements.txt` before running backend scripts.
- **No Build Tools:** No npm, webpack, or other JS build tools detected.
- **Static Assets:** Referenced from `assets/`.

## Examples
- To add a faculty member: update `add-faculty.html` and `add-faculty-app.js`, then test with `test_add_faculty.py`.
- To fix database issues: run `fix_db.py` or `recreate_db_complete.py`.

## Key Files & Directories
- `server.py`: Backend entry point
- `requirements.txt`: Python dependencies
- `components/`: Shared JS components
- `assets/`: Static files
- `instance/`, `new fd/`: Deployment copies

## AI Agent Guidance
- Always check which instance folder is active before editing.
- Follow file pairing conventions for new features.
- Reference existing scripts for database operations.
- Avoid introducing frameworks unless requested.

---
Feedback is welcome! Please specify unclear or missing sections for further improvement.