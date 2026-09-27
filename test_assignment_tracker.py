from fastapi.testclient import TestClient

from student_assignment_tracker_buggy import app

client = TestClient(app)


def reset_api_data():
    client.post("/reset")


# ---------------------------------------------------------------------------
# Existing tests (must remain passing before and after fixes)
# ---------------------------------------------------------------------------

def test_create_valid_assignment():
    reset_api_data()

    response = client.post(
        "/assignments",
        json={
            "title": "Machine Learning Assignment",
            "courseCode": "AI101",
            "dueDate": "2026-10-10",
            "maxMarks": 100
        }
    )

    assert response.status_code == 201
    assert response.json()["courseCode"] == "AI101"


def test_submit_before_due_date():
    reset_api_data()

    assignment_response = client.post(
        "/assignments",
        json={
            "title": "Python Assignment",
            "courseCode": "PY101",
            "dueDate": "2026-10-10",
            "maxMarks": 50
        }
    )

    assignment_id = assignment_response.json()["id"]

    response = client.post(
        "/submissions",
        json={
            "assignmentId": assignment_id,
            "studentName": "Premkumar",
            "submittedAt": "2026-10-09T10:00:00"
        }
    )

    assert response.status_code == 201


# ---------------------------------------------------------------------------
# BUG 1 — courseCode must be required
# Regression: omitting courseCode must return 400 (custom validation handler)
# FAILS against buggy code (returns 201); PASSES after fix.
# ---------------------------------------------------------------------------

def test_courseCode_required():
    """POST /assignments without courseCode must be rejected with 400."""
    reset_api_data()

    response = client.post(
        "/assignments",
        json={
            "title": "No Course Assignment",
            "dueDate": "2026-11-01",
            "maxMarks": 50
        }
    )

    assert response.status_code == 400
    assert "error" in response.json()


# ---------------------------------------------------------------------------
# BUG 2 — maxMarks upper bound must be 100, not 1000
# Regression: maxMarks=101 must return 400
# FAILS against buggy code (returns 201); PASSES after fix.
# ---------------------------------------------------------------------------

def test_maxMarks_exceeds_100_rejected():
    """POST /assignments with maxMarks > 100 must be rejected with 400."""
    reset_api_data()

    response = client.post(
        "/assignments",
        json={
            "title": "Over-Marked Assignment",
            "courseCode": "CS101",
            "dueDate": "2026-11-01",
            "maxMarks": 101
        }
    )

    assert response.status_code == 400
    assert "error" in response.json()


def test_maxMarks_boundary_100_accepted():
    """POST /assignments with maxMarks=100 must be accepted (boundary value)."""
    reset_api_data()

    response = client.post(
        "/assignments",
        json={
            "title": "Boundary Assignment",
            "courseCode": "CS101",
            "dueDate": "2026-11-01",
            "maxMarks": 100
        }
    )

    assert response.status_code == 201


def test_maxMarks_boundary_1_accepted():
    """POST /assignments with maxMarks=1 must be accepted (lower boundary)."""
    reset_api_data()

    response = client.post(
        "/assignments",
        json={
            "title": "Minimum Marks Assignment",
            "courseCode": "CS101",
            "dueDate": "2026-11-01",
            "maxMarks": 1
        }
    )

    assert response.status_code == 201


# ---------------------------------------------------------------------------
# BUG 3 — GET /assignments must filter by courseCode query param
# Regression: two assignments with different codes; filter must return only one
# FAILS against buggy code (returns both); PASSES after fix.
# ---------------------------------------------------------------------------

def test_list_assignments_filters_by_courseCode():
    """GET /assignments?courseCode=X must return only assignments for course X."""
    reset_api_data()

    client.post(
        "/assignments",
        json={
            "title": "Maths Assignment",
            "courseCode": "MA101",
            "dueDate": "2026-11-01",
            "maxMarks": 50
        }
    )
    client.post(
        "/assignments",
        json={
            "title": "Physics Assignment",
            "courseCode": "PH101",
            "dueDate": "2026-11-01",
            "maxMarks": 50
        }
    )

    response = client.get("/assignments", params={"courseCode": "MA101"})

    assert response.status_code == 200
    results = response.json()
    assert len(results) == 1
    assert results[0]["courseCode"] == "MA101"


def test_list_assignments_no_filter_returns_all():
    """GET /assignments without a filter must return all assignments."""
    reset_api_data()

    for i in range(3):
        client.post(
            "/assignments",
            json={
                "title": f"Assignment {i}",
                "courseCode": f"CS10{i}",
                "dueDate": "2026-11-01",
                "maxMarks": 50
            }
        )

    response = client.get("/assignments")

    assert response.status_code == 200
    assert len(response.json()) == 3


# ---------------------------------------------------------------------------
# BUG 4 — Late submissions must be rejected
# Regression: submittedAt one day past dueDate must return 422
# FAILS against buggy code (returns 201); PASSES after fix.
# ---------------------------------------------------------------------------

def test_submit_after_due_date_rejected():
    """POST /submissions with submittedAt past dueDate must return 422."""
    reset_api_data()

    assignment_response = client.post(
        "/assignments",
        json={
            "title": "Late Test Assignment",
            "courseCode": "CS101",
            "dueDate": "2026-10-10",
            "maxMarks": 50
        }
    )
    assignment_id = assignment_response.json()["id"]

    response = client.post(
        "/submissions",
        json={
            "assignmentId": assignment_id,
            "studentName": "Late Student",
            "submittedAt": "2026-10-11T00:00:01"  # one second past due date
        }
    )

    assert response.status_code == 422
    assert "error" in response.json()


def test_submit_on_due_date_accepted():
    """POST /submissions with submittedAt equal to dueDate must be accepted."""
    reset_api_data()

    assignment_response = client.post(
        "/assignments",
        json={
            "title": "On-Time Assignment",
            "courseCode": "CS101",
            "dueDate": "2026-10-10",
            "maxMarks": 50
        }
    )
    assignment_id = assignment_response.json()["id"]

    response = client.post(
        "/submissions",
        json={
            "assignmentId": assignment_id,
            "studentName": "On Time Student",
            "submittedAt": "2026-10-10T23:59:59"  # last second of due date
        }
    )

    assert response.status_code == 201


# ---------------------------------------------------------------------------
# Coverage tests for compliant-but-untested paths
# ---------------------------------------------------------------------------

def test_get_assignment_by_id():
    """GET /assignments/{id} for an existing assignment returns 200."""
    reset_api_data()

    create_resp = client.post(
        "/assignments",
        json={
            "title": "Lookup Assignment",
            "courseCode": "CS200",
            "dueDate": "2026-12-01",
            "maxMarks": 80
        }
    )
    assignment_id = create_resp.json()["id"]

    response = client.get(f"/assignments/{assignment_id}")

    assert response.status_code == 200
    assert response.json()["id"] == assignment_id
    assert response.json()["courseCode"] == "CS200"


def test_get_assignment_not_found():
    """GET /assignments/{id} for unknown id returns 404 with error key."""
    reset_api_data()

    response = client.get("/assignments/99999")

    assert response.status_code == 404
    assert "error" in response.json()


def test_submit_unknown_assignment_rejected():
    """POST /submissions with non-existent assignmentId returns 404."""
    reset_api_data()

    response = client.post(
        "/submissions",
        json={
            "assignmentId": 99999,
            "studentName": "Ghost Student",
            "submittedAt": "2026-10-01T10:00:00"
        }
    )

    assert response.status_code == 404
    assert "error" in response.json()


def test_list_submissions():
    """GET /submissions returns 200 and a list."""
    reset_api_data()

    assignment_response = client.post(
        "/assignments",
        json={
            "title": "Sub List Assignment",
            "courseCode": "CS300",
            "dueDate": "2026-12-01",
            "maxMarks": 60
        }
    )
    assignment_id = assignment_response.json()["id"]

    client.post(
        "/submissions",
        json={
            "assignmentId": assignment_id,
            "studentName": "Student A",
            "submittedAt": "2026-11-01T10:00:00"
        }
    )

    response = client.get("/submissions")

    assert response.status_code == 200
    assert len(response.json()) == 1


def test_courseCode_normalised_to_uppercase():
    """courseCode sent in lowercase must be stored and returned as uppercase."""
    reset_api_data()

    response = client.post(
        "/assignments",
        json={
            "title": "Normalisation Test",
            "courseCode": "cs101",
            "dueDate": "2026-12-01",
            "maxMarks": 50
        }
    )

    assert response.status_code == 201
    assert response.json()["courseCode"] == "CS101"


# ---------------------------------------------------------------------------
# Gap a — Empty courseCode must be rejected
# courseCode has min_length=2; an empty string violates that constraint.
# ---------------------------------------------------------------------------

def test_courseCode_empty_rejected():
    """POST /assignments with courseCode='' must be rejected with 400."""
    reset_api_data()

    response = client.post(
        "/assignments",
        json={
            "title": "Empty Course Assignment",
            "courseCode": "",
            "dueDate": "2026-11-01",
            "maxMarks": 50
        }
    )

    assert response.status_code == 400
    assert "error" in response.json()


# ---------------------------------------------------------------------------
# Gap b — maxMarks below 1 must be rejected
# maxMarks has ge=1; zero or negative values violate that constraint.
# ---------------------------------------------------------------------------

def test_maxMarks_below_1_rejected():
    """POST /assignments with maxMarks=0 must be rejected with 400."""
    reset_api_data()

    response = client.post(
        "/assignments",
        json={
            "title": "Zero Marks Assignment",
            "courseCode": "CS101",
            "dueDate": "2026-11-01",
            "maxMarks": 0
        }
    )

    assert response.status_code == 400
    assert "error" in response.json()


# ---------------------------------------------------------------------------
# Gap c — courseCode filter must be case-insensitive
# Query param is normalised via .strip().upper() before comparison,
# so a lowercase query must match the uppercase stored value.
# ---------------------------------------------------------------------------

def test_list_assignments_filters_by_courseCode_case_insensitive():
    """GET /assignments?courseCode=ma101 must match stored courseCode=MA101."""
    reset_api_data()

    client.post(
        "/assignments",
        json={
            "title": "Case Test Assignment",
            "courseCode": "MA101",
            "dueDate": "2026-11-01",
            "maxMarks": 50
        }
    )
    client.post(
        "/assignments",
        json={
            "title": "Other Assignment",
            "courseCode": "PH101",
            "dueDate": "2026-11-01",
            "maxMarks": 50
        }
    )

    response = client.get("/assignments", params={"courseCode": "ma101"})

    assert response.status_code == 200
    results = response.json()
    assert len(results) == 1
    assert results[0]["courseCode"] == "MA101"
