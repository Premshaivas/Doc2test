# Compliance Report — Before New Tests Added

**Generated for:** This session's coverage-gap analysis  
**Implementation file:** `student_assignment_tracker_buggy.py`  
**Test file:** `test_assignment_tracker.py`  
**Pytest version:** 9.1.1 / Python 3.14.2  
**Baseline run:** 15 tests collected, 15 passed, 0 failed, exit code 0

---

## Baseline Test Run (pre-addition)

```
========================= 15 passed, 2 warnings in 0.75s =========================
```

| Metric | Value |
|--------|-------|
| Tests collected | 15 |
| Passed | 15 |
| Failed | 0 |
| Exit code | 0 |
| Warnings | 2 (cosmetic — httpx deprecation and Starlette HTTP constant rename) |

All 15 tests pass. The warnings are cosmetic:
- `httpx` deprecation: install `httpx2` to silence (no behavioural impact).
- `HTTP_422_UNPROCESSABLE_ENTITY` renamed to `HTTP_422_UNPROCESSABLE_CONTENT` in a newer Starlette version; the integer value `422` is identical.

---

## Original Four Intentional Requirement Violations — Current Status

These bugs were introduced deliberately in `student_assignment_tracker_buggy.py` and have already been fixed in a prior session. All four are now **COMPLIANT**.

| Bug ID | Requirement | Original Violation | Fix Applied | Current Status |
|--------|-------------|-------------------|-------------|----------------|
| Bug 1 | `courseCode` is a required field on `POST /assignments` | Declared `str \| None = Field(default=None, …)` — omitting it was accepted, null stored | Changed to `str = Field(..., …)` — field is now required | ✅ **COMPLIANT** |
| Bug 2 | `maxMarks` must be between 1 and 100 inclusive | Upper bound set to `le=1000` — values 101–1000 were accepted | Changed to `le=100` | ✅ **COMPLIANT** |
| Bug 3 | `GET /assignments?courseCode=X` must filter to matching assignments only | Filter parameter was parsed but ignored; all assignments always returned | Added `if courseCode is not None: return [a for a in assignments if a["courseCode"] == normalised]` | ✅ **COMPLIANT** |
| Bug 4 | `POST /submissions` must reject `submittedAt` values past `dueDate` (HTTP 422) | No date comparison performed; all submissions accepted regardless of timing | Added `if submitted_at.date() > assignment["dueDate"]: raise HTTPException(422, …)` | ✅ **COMPLIANT** |

---

## Three Identified Test-Coverage Gaps

Despite all four bugs being fixed and all 15 existing tests passing, the Test Engineer subagent identified **three scenarios from the approved checklist that lack dedicated test coverage**.

The code is not considered **fully verified** until these three tests are added and pass. A compliant implementation that lacks test coverage for a scenario provides no ongoing regression protection for that scenario.

### Gap a — Empty `courseCode` rejection

| Item | Detail |
|------|--------|
| **Scenario** | `POST /assignments` with `courseCode: ""` must be rejected with HTTP 400 |
| **Requirement** | `courseCode` has `min_length=2`; an empty string violates this constraint |
| **Current coverage** | `test_courseCode_required` covers the omitted-field case; no test covers the empty-string case |
| **Missing test** | `test_courseCode_empty_rejected` |
| **Expected result** | HTTP 400 + `{"error": "..."}` |

### Gap b — `maxMarks` below 1 rejection

| Item | Detail |
|------|--------|
| **Scenario** | `POST /assignments` with `maxMarks: 0` must be rejected with HTTP 400 |
| **Requirement** | `maxMarks` has `ge=1`; zero or negative values violate this constraint |
| **Current coverage** | `test_maxMarks_exceeds_100_rejected` covers the upper-bound case; no test covers the lower-bound case |
| **Missing test** | `test_maxMarks_below_1_rejected` |
| **Expected result** | HTTP 400 + `{"error": "..."}` |

### Gap c — Case-insensitive `courseCode` filtering

| Item | Detail |
|------|--------|
| **Scenario** | `GET /assignments?courseCode=ma101` must match assignments stored as `MA101` |
| **Requirement** | The filter normalises the query param via `.strip().upper()` before comparing — so `ma101` → `MA101` must match stored `MA101` |
| **Current coverage** | `test_list_assignments_filters_by_courseCode` uses uppercase input (`MA101`); no test sends lowercase and verifies the match |
| **Missing test** | `test_list_assignments_filters_by_courseCode_case_insensitive` |
| **Expected result** | HTTP 200 + list of length 1 with `courseCode == "MA101"` |

---

## Compliance Gate

> **The implementation is considered fully verified only after the complete test suite — including all three new tests — passes with exit code 0.**

The three tests will be appended to `test_assignment_tracker.py` and `pytest -v` will be re-run. If any new test fails, it indicates a confirmed requirement violation and the implementation will be inspected. No changes to `student_assignment_tracker_buggy.py` will be made without explicit approval.

See `reports/compliance_report_after.md` for the post-addition results.
