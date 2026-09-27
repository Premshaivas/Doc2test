"""Intentionally buggy Student Assignment Tracker API.

This file is designed for the Doc2Test Guardian IBM Bob hackathon demo.
The code deliberately violates requirements in
assignment_api_requirements.md so IBM Bob can detect, test, and fix them.

Run:
    uvicorn student_assignment_tracker_buggy:app --reload
"""

import os
from datetime import date, datetime, timezone

from fastapi import FastAPI, HTTPException, Query, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator

app = FastAPI(
    title="Student Assignment Tracker API — Buggy Demo",
    version="0.1.0",
    description="Intentionally non-compliant API for the Doc2Test Guardian workflow.",
)

# ---------------------------------------------------------------------------
# CORS — read configuration from environment variables.
#
# ALLOW_ALL_CORS=true  → wildcard origins (demo only, never in production)
# ALLOWED_ORIGINS      → comma-separated extra origins to whitelist
# ---------------------------------------------------------------------------
_allow_all = os.getenv("ALLOW_ALL_CORS", "false").strip().lower() == "true"

if _allow_all:
    _origins: list[str] = ["*"]
    _credentials = False
else:
    _default_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:4173",
        "http://localhost:8501",
    ]
    _extra_origins = [
        o.strip()
        for o in os.getenv("ALLOWED_ORIGINS", "").split(",")
        if o.strip()
    ]
    _origins = _default_origins + _extra_origins
    _credentials = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=_credentials,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)

assignments: list[dict] = []
submissions: list[dict] = []
assignment_id_counter = 1
submission_id_counter = 1


class AssignmentCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=120)
    # FIX 1: courseCode is now required.
    courseCode: str = Field(..., min_length=2, max_length=20)
    dueDate: date
    # FIX 2: maxMarks upper bound corrected to 100.
    maxMarks: int = Field(..., ge=1, le=100)

    @field_validator("courseCode")
    @classmethod
    def normalize_course_code(cls, value: str) -> str:
        return value.strip().upper()


class AssignmentResponse(BaseModel):
    id: int
    title: str
    courseCode: str
    dueDate: date
    maxMarks: int


class SubmissionCreate(BaseModel):
    assignmentId: int = Field(..., gt=0)
    studentName: str = Field(..., min_length=2, max_length=100)
    submittedAt: datetime | None = None

    @field_validator("studentName")
    @classmethod
    def normalize_student_name(cls, value: str) -> str:
        return value.strip()


class SubmissionResponse(BaseModel):
    id: int
    assignmentId: int
    studentName: str
    submittedAt: datetime


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"error": exc.detail})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    first_error = exc.errors()[0]
    field_name = ".".join(str(part) for part in first_error["loc"][1:])
    message = first_error["msg"]
    if field_name:
        message = f"{field_name}: {message}"
    return JSONResponse(status_code=400, content={"error": message})


@app.get("/", tags=["Health"])
def health_check() -> dict:
    return {"message": "Buggy Student Assignment Tracker API is running"}


@app.get("/health", tags=["Health"])
def health() -> dict:
    return {"status": "ok", "service": "Student Assignment Tracker API"}


@app.post(
    "/assignments",
    response_model=AssignmentResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Assignments"],
)
def create_assignment(payload: AssignmentCreate) -> dict:
    global assignment_id_counter
    assignment = {
        "id": assignment_id_counter,
        "title": payload.title.strip(),
        "courseCode": payload.courseCode,
        "dueDate": payload.dueDate,
        "maxMarks": payload.maxMarks,
    }
    assignments.append(assignment)
    assignment_id_counter += 1
    return assignment


@app.get("/assignments", response_model=list[AssignmentResponse], tags=["Assignments"])
def list_assignments(
    courseCode: str | None = Query(default=None, min_length=2, max_length=20)
) -> list[dict]:
    # FIX 3: filter by courseCode when provided.
    if courseCode is not None:
        normalised = courseCode.strip().upper()
        return [a for a in assignments if a["courseCode"] == normalised]
    return assignments


@app.get(
    "/assignments/{assignment_id}",
    response_model=AssignmentResponse,
    tags=["Assignments"],
)
def get_assignment(assignment_id: int) -> dict:
    for assignment in assignments:
        if assignment["id"] == assignment_id:
            return assignment
    raise HTTPException(status_code=404, detail="Assignment not found")


@app.post(
    "/submissions",
    response_model=SubmissionResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Submissions"],
)
def create_submission(payload: SubmissionCreate) -> dict:
    global submission_id_counter
    assignment = next(
        (item for item in assignments if item["id"] == payload.assignmentId),
        None,
    )
    if assignment is None:
        raise HTTPException(status_code=404, detail="Assignment not found")

    submitted_at = payload.submittedAt or datetime.now(timezone.utc)
    if submitted_at.tzinfo is not None:
        submitted_at = submitted_at.astimezone(timezone.utc).replace(tzinfo=None)

    # FIX 4: reject submissions past the due date.
    if submitted_at.date() > assignment["dueDate"]:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Submission is past the due date",
        )

    submission = {
        "id": submission_id_counter,
        "assignmentId": payload.assignmentId,
        "studentName": payload.studentName,
        "submittedAt": submitted_at,
    }
    submissions.append(submission)
    submission_id_counter += 1
    return submission


@app.get("/submissions", response_model=list[SubmissionResponse], tags=["Submissions"])
def list_submissions() -> list[dict]:
    return submissions


@app.post("/reset", tags=["Development"])
def reset_data() -> dict:
    global assignment_id_counter, submission_id_counter
    assignments.clear()
    submissions.clear()
    assignment_id_counter = 1
    submission_id_counter = 1
    return {"message": "All data has been reset"}
