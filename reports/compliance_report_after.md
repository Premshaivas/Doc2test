# Compliance Report — After New Tests Added

**Generated for:** This session's coverage-gap closure  
**Implementation file:** `student_assignment_tracker_buggy.py`  
**Test file:** `test_assignment_tracker.py`  
**Pytest version:** 9.1.1 / Python 3.14.2  
**Final run:** 18 tests collected, 18 passed, 0 failed, exit code 0

---

## Final Test Run

```
========================= 18 passed, 2 warnings in 0.71s =========================
```

| Metric | Before (this session) | After (this session) |
|--------|----------------------|---------------------|
| Tests collected | 15 | **18** |
| Passed | 15 | **18** |
| Failed | 0 | **0** |
| Exit code | 0 | **0** |
| `student_assignment_tracker_buggy.py` modified | — | **No** |

The three new tests all passed immediately against the existing implementation — confirming the code was already compliant for all three scenarios, but lacked the tests to prove it.

---

## Tests Added This Session

| Test Name | Scenario | Result |
|-----------|----------|--------|
| `test_courseCode_empty_rejected` | Gap a — `courseCode: ""` must return HTTP 400 | ✅ PASSED |
| `test_maxMarks_below_1_rejected` | Gap b — `maxMarks: 0` must return HTTP 400 | ✅ PASSED |
| `test_list_assignments_filters_by_courseCode_case_insensitive` | Gap c — lowercase filter query must match uppercase stored value | ✅ PASSED |

---

## Files Changed

| File | Change |
|------|--------|
| `test_assignment_tracker.py` | 3 tests appended (lines 360–441) |
| `reports/compliance_report_before.md` | Overwritten with this-session baseline |
| `reports/compliance_report_after.md` | This file — created |
| `student_assignment_tracker_buggy.py` | **Not modified** |

---

## Complete Test Suite — Final Status (18 tests)

| # | Test | Requirement Covered | Result |
|---|------|---------------------|--------|
| 1 | `test_create_valid_assignment` | Happy-path assignment creation → 201 | ✅ |
| 2 | `test_submit_before_due_date` | Happy-path on-time submission → 201 | ✅ |
| 3 | `test_courseCode_required` | Bug 1 fix — omitting `courseCode` → 400 | ✅ |
| 4 | `test_maxMarks_exceeds_100_rejected` | Bug 2 fix — `maxMarks=101` → 400 | ✅ |
| 5 | `test_maxMarks_boundary_100_accepted` | Bug 2 fix — `maxMarks=100` accepted (upper boundary) | ✅ |
| 6 | `test_maxMarks_boundary_1_accepted` | Bug 2 fix — `maxMarks=1` accepted (lower boundary) | ✅ |
| 7 | `test_list_assignments_filters_by_courseCode` | Bug 3 fix — uppercase filter returns only matching | ✅ |
| 8 | `test_list_assignments_no_filter_returns_all` | Bug 3 fix — no filter returns all | ✅ |
| 9 | `test_submit_after_due_date_rejected` | Bug 4 fix — past-due `submittedAt` → 422 | ✅ |
| 10 | `test_submit_on_due_date_accepted` | Bug 4 fix — same-day submission accepted | ✅ |
| 11 | `test_get_assignment_by_id` | `GET /assignments/{id}` happy path → 200 | ✅ |
| 12 | `test_get_assignment_not_found` | Unknown `id` → 404 + `{"error": ...}` | ✅ |
| 13 | `test_submit_unknown_assignment_rejected` | Unknown `assignmentId` → 404 + `{"error": ...}` | ✅ |
| 14 | `test_list_submissions` | `GET /submissions` → 200 + list | ✅ |
| 15 | `test_courseCode_normalised_to_uppercase` | Lowercase `courseCode` stored as uppercase | ✅ |
| 16 | `test_courseCode_empty_rejected` *(new)* | Gap a — `courseCode: ""` → 400 + `{"error": ...}` | ✅ |
| 17 | `test_maxMarks_below_1_rejected` *(new)* | Gap b — `maxMarks: 0` → 400 + `{"error": ...}` | ✅ |
| 18 | `test_list_assignments_filters_by_courseCode_case_insensitive` *(new)* | Gap c — lowercase filter matches uppercase stored value | ✅ |

---

## Original Requirement Violations — Confirmed Compliance Status

| Bug ID | Requirement | Fix Applied (prior session) | Regression Test | Status |
|--------|-------------|----------------------------|-----------------|--------|
| Bug 1 | `courseCode` required | `str = Field(..., …)` | `test_courseCode_required` (#3) | ✅ **COMPLIANT** |
| Bug 2 | `maxMarks` 1–100 | `le=100` | `test_maxMarks_exceeds_100_rejected` (#4) | ✅ **COMPLIANT** |
| Bug 3 | `courseCode` filter applied | Filter block added | `test_list_assignments_filters_by_courseCode` (#7) | ✅ **COMPLIANT** |
| Bug 4 | Late submission rejected | Date check + HTTP 422 | `test_submit_after_due_date_rejected` (#9) | ✅ **COMPLIANT** |

---

## Remaining Limitations

| Item | Detail |
|------|--------|
| Cosmetic warnings | `HTTP_422_UNPROCESSABLE_ENTITY` is deprecated in newer Starlette; rename to `HTTP_422_UNPROCESSABLE_CONTENT` when upgrading Starlette. The integer value `422` is identical — no behavioural impact. |
| Cosmetic warnings | `httpx` deprecated in favour of `httpx2` for `TestClient`. No behavioural impact. |
| In-memory state | All data lives in module-level Python lists. State is lost on process restart. The `/reset` endpoint is a test utility, not a production feature. |
| No authentication | The API has no auth layer — all endpoints are publicly accessible. |
| Single test file | All tests are in one flat file; as coverage grows, consider grouping by endpoint in separate modules. |
| `submittedAt` precision | The late-submission check compares dates (not datetimes). A submission at `23:59:59` on `dueDate` is accepted; the spec's intent is "by end of day", which this satisfies. |
