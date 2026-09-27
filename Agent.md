# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project

Python FastAPI assignment tracker API. `student_assignment_tracker_buggy.py` is **intentionally buggy** against `assignment_api_requirements.md` (both files are PDFs named `.md`). Tests live in `test_assignment_tracker.py`.

## Commands

```bash
# Run all tests
pytest test_assignment_tracker.py

# Run a single test
pytest test_assignment_tracker.py::test_create_valid_assignment

# Run the API server
uvicorn student_assignment_tracker_buggy:app --reload
```

## Critical Non-Obvious Facts

- **`README.md` and `assignment_api_requirements.md` are binary PDFs**, not readable markdown — do not attempt to parse them as text.
- **All state is in-memory global lists** (`assignments`, `submissions`) with integer counters. There is no database.
- **`/reset` endpoint** (`POST /reset`) clears all in-memory state; every test calls `reset_api_data()` which hits this endpoint first — required to keep tests isolated.
- The app is imported directly in tests as `from student_assignment_tracker_buggy import app` — the module name is the full filename without `.py`.
- `TestClient` from `fastapi.testclient` (backed by `httpx`) is used, not `requests`.

## Known Intentional Bugs (do not fix unless asked)

1. `courseCode` is optional (`str | None`) — should be required.
2. `maxMarks` allows up to 1000 — should be capped at 100.
3. `GET /assignments` ignores `courseCode` query filter — should filter by it.
4. `POST /submissions` does not reject late submissions — should reject if `submittedAt > dueDate`.

## Code Style

- Pydantic v2 models with `Field`, `field_validator`, `@classmethod`.
- camelCase field names on Pydantic models (matching JSON API contract).
- Custom `HTTPException` and `RequestValidationError` handlers return `{"error": "..."}` — all error responses use this shape.
- `status.HTTP_201_CREATED` used explicitly on `POST` endpoints.
