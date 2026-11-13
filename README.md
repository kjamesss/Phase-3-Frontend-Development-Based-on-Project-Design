# BU Student Academic Task and Deadline Management System

Phase 3 frontend for IT 112 Web Systems and Technologies · Group 5, BSIS-2B · Bicol University Polangui

## Open the prototype

Open [frontend/index.html](frontend/index.html) in a browser. Choose **Explore student demo** or **Explore admin demo** on the home page. Bootstrap 5.3.9 is bundled locally, so the prototype opens without a build step or an internet connection.

Use sample values when trying the forms. Keyword search and filters work on fictional tasks in the browser. Forms provide native input validation and a message when a submitted action needs the API.

## Phase 1 alignment

| Page | Role and use case | ERD fields and behavior |
| --- | --- | --- |
| [Home](frontend/index.html) | Entry point for registration, login, and the two demo flows | Introduces coursework, subject, and task status with sample data. |
| [Log in](frontend/login.html) | Student or administrator signs in | Collects email and password. The API will check Users.passwordHash and route by role. |
| [Register](frontend/register.html) | Student creates an account | Collects name, email, and password. The API will assign the default user role and hash the password. |
| [Dashboard](frontend/dashboard.html) | Student views progress and upcoming or overdue deadlines | Uses Tasks.status for counts and Tasks.dueDate for deadlines. Upcoming covers today through the next seven days. Completed tasks are excluded from deadline lists. |
| [Tasks](frontend/tasks.html) | Student views, searches, filters, creates, edits, or deletes personal tasks | title, optional description, required dueDate, priority, status, and optional category referencing Categories._id. Edit and delete carry the selected task _id. The subject form collects Categories.name and optional color. |
| [Profile](frontend/profile.html) | Student reviews or updates account details | Users.name and Users.email are editable. Role and join date are read-only. |
| [Administration](frontend/admin.html) | Administrator manages accounts and views all tasks | Account forms use Users._id, name, email, and role. The oversight table links each task's owner to a sample user. |

The Phase 1 roles are User (shown as Student) and Administrator. Task status options are To Do, In Progress, and Completed. Priority options are Low, Medium, and High.

## API handoff

All forms use explicit IDs, named controls, a placeholder action, and a GET or POST method. [api-placeholder.js](frontend/js/api-placeholder.js) is the integration point for future Fetch requests to Express. The API will enforce role and task ownership, validate fields, hash passwords, and manage identifiers and timestamps through Mongoose. Student and admin demos are public previews of fictional data.

Identifiers, ownership references, password hashes, and timestamps are controlled by the future backend. The hidden _id fields identify the selected record in edit and delete dialogs. Category choices use ObjectId-shaped sample references. The empty subject option represents an optional category relationship.

## Review the frontend

1. Open the student demo and follow a deadline link to its matching task.
2. Combine the keyword, status, priority, and subject filters. Clear filters to restore all six sample tasks.
3. Open New task, New subject, Edit, and Delete. Required inputs use browser validation. Each submitted action identifies the API connection it needs.
4. Open the admin demo and inspect account edit/delete dialogs and tasks from both sample students.
5. Resize to a phone width. Open the collapsed navigation and scroll the administrator tables horizontally.

The verification pass covered all seven pages at desktop and phone widths, navigation, task filters and empty results, form fields, whitespace validation, dialog population, and placeholder feedback. Sample deadlines are relative to the browser's current date. Each member's reflection contains three sentences and follows the role declared in Phase 1.

[Phase 3 report](docs/lab11/Phase-3-Report.pdf) · [Lab screenshots](docs/lab11/)
