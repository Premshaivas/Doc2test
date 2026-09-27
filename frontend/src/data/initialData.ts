import { Assignment, Submission, TraceabilityItem, TestScenario } from '../types';

export const SEED_ASSIGNMENTS: Assignment[] = [
  {
    id: 'ASN-101',
    title: 'Machine Learning Assignment',
    courseCode: 'AI101',
    dueDate: '2026-10-10',
    maxMarks: 100,
    createdAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'ASN-102',
    title: 'Python Lab',
    courseCode: 'PY101',
    dueDate: '2026-10-12',
    maxMarks: 50,
    createdAt: '2026-09-21T14:30:00Z',
  },
  {
    id: 'ASN-103',
    title: 'AI Lab',
    courseCode: 'AI101',
    dueDate: '2026-10-15',
    maxMarks: 50,
    createdAt: '2026-09-22T09:15:00Z',
  },
];

export const SEED_SUBMISSIONS: Submission[] = [
  {
    id: 'SUB-301',
    assignmentId: 'ASN-101',
    assignmentTitle: 'Machine Learning Assignment',
    courseCode: 'AI101',
    studentName: 'Alex Rivera',
    submittedAt: '2026-10-08 14:22',
    dueDate: '2026-10-10',
    isLate: false,
    status: 'Accepted',
  },
  {
    id: 'SUB-302',
    assignmentId: 'ASN-102',
    assignmentTitle: 'Python Lab',
    courseCode: 'PY101',
    studentName: 'Devon Vance',
    submittedAt: '2026-10-11 09:40',
    dueDate: '2026-10-12',
    isLate: false,
    status: 'Accepted',
  },
];

export const TRACEABILITY_MATRIX: TraceabilityItem[] = [
  {
    id: 'REQ-01',
    requirement: 'courseCode is required and non-empty',
    category: 'Validation',
    endpoint: 'POST /assignments',
    evidence: 'Required-field and empty-value tests',
    status: 'Compliant',
  },
  {
    id: 'REQ-02',
    requirement: 'maxMarks must be between 1 and 100',
    category: 'Validation',
    endpoint: 'POST /assignments',
    evidence: 'Lower and upper boundary tests',
    status: 'Compliant',
  },
  {
    id: 'REQ-03',
    requirement: 'Course-code filtering returns matching assignments only',
    category: 'Functional behavior',
    endpoint: 'GET /assignments',
    evidence: 'Filter regression test',
    status: 'Compliant',
  },
  {
    id: 'REQ-04',
    requirement: 'Course-code filtering is case-insensitive',
    category: 'Functional behavior',
    endpoint: 'GET /assignments',
    evidence: 'Case-insensitive filter test',
    status: 'Compliant',
  },
  {
    id: 'REQ-05',
    requirement: 'Late submissions are rejected',
    category: 'Business rule',
    endpoint: 'POST /submissions',
    evidence: 'Late-submission regression test',
    status: 'Compliant',
  },
  {
    id: 'REQ-06',
    requirement: 'Unknown assignment ID returns HTTP 404',
    category: 'Error handling',
    endpoint: 'POST /submissions',
    evidence: 'Missing-assignment test',
    status: 'Compliant',
  },
  {
    id: 'REQ-07',
    requirement: 'Errors use the error JSON key',
    category: 'API contract',
    endpoint: 'All API endpoints',
    evidence: 'Error-path tests',
    status: 'Compliant',
  },
];

export const TEST_SCENARIOS: TestScenario[] = [
  {
    id: 'TEST-01',
    scenario: 'Valid assignment creation',
    category: 'Validation',
    endpoint: 'POST /assignments',
    testFunction: 'tests/test_assignments.py::test_create_valid_assignment',
    status: 'Passed',
    durationMs: 42,
    isRegressionGap: false,
  },
  {
    id: 'TEST-02',
    scenario: 'Missing courseCode rejected',
    category: 'Validation',
    endpoint: 'POST /assignments',
    testFunction: 'tests/test_assignments.py::test_missing_course_code',
    status: 'Passed',
    durationMs: 38,
    isRegressionGap: false,
  },
  {
    id: 'TEST-03',
    scenario: 'Empty courseCode rejected',
    category: 'Validation',
    endpoint: 'POST /assignments',
    testFunction: 'tests/test_assignments.py::test_empty_course_code_whitespace',
    status: 'Passed',
    durationMs: 35,
    isRegressionGap: true, // Gap closed
  },
  {
    id: 'TEST-04',
    scenario: 'maxMarks above 100 rejected',
    category: 'Validation',
    endpoint: 'POST /assignments',
    testFunction: 'tests/test_assignments.py::test_max_marks_above_100_rejected',
    status: 'Passed',
    durationMs: 41,
    isRegressionGap: false,
  },
  {
    id: 'TEST-05',
    scenario: 'maxMarks below 1 rejected',
    category: 'Validation',
    endpoint: 'POST /assignments',
    testFunction: 'tests/test_assignments.py::test_max_marks_below_1_rejected',
    status: 'Passed',
    durationMs: 39,
    isRegressionGap: true, // Gap closed
  },
  {
    id: 'TEST-06',
    scenario: 'Assignment filtering works',
    category: 'Functional behavior',
    endpoint: 'GET /assignments',
    testFunction: 'tests/test_assignments.py::test_filter_assignments_exact_match',
    status: 'Passed',
    durationMs: 48,
    isRegressionGap: false,
  },
  {
    id: 'TEST-07',
    scenario: 'Case-insensitive filtering works',
    category: 'Functional behavior',
    endpoint: 'GET /assignments',
    testFunction: 'tests/test_assignments.py::test_case_insensitive_filtering',
    status: 'Passed',
    durationMs: 52,
    isRegressionGap: true, // Gap closed
  },
  {
    id: 'TEST-08',
    scenario: 'Submission before due date accepted',
    category: 'Business rule',
    endpoint: 'POST /submissions',
    testFunction: 'tests/test_submissions.py::test_submission_before_due_date_allowed',
    status: 'Passed',
    durationMs: 44,
    isRegressionGap: false,
  },
  {
    id: 'TEST-09',
    scenario: 'Submission on due date accepted',
    category: 'Business rule',
    endpoint: 'POST /submissions',
    testFunction: 'tests/test_submissions.py::test_submission_on_due_date_allowed',
    status: 'Passed',
    durationMs: 40,
    isRegressionGap: false,
  },
  {
    id: 'TEST-10',
    scenario: 'Late submission rejected',
    category: 'Business rule',
    endpoint: 'POST /submissions',
    testFunction: 'tests/test_submissions.py::test_late_submission_rejected',
    status: 'Passed',
    durationMs: 46,
    isRegressionGap: false,
  },
  {
    id: 'TEST-11',
    scenario: 'Unknown assignment ID returns HTTP 404',
    category: 'Error handling',
    endpoint: 'POST /submissions',
    testFunction: 'tests/test_submissions.py::test_unknown_assignment_id_404',
    status: 'Passed',
    durationMs: 37,
    isRegressionGap: false,
  },
  {
    id: 'TEST-12',
    scenario: 'Error responses use the error JSON key',
    category: 'API contract',
    endpoint: 'All API endpoints',
    testFunction: 'tests/test_contracts.py::test_error_schema_consistent_key',
    status: 'Passed',
    durationMs: 43,
    isRegressionGap: false,
  },
  {
    id: 'TEST-13',
    scenario: 'Title length below 3 characters rejected',
    category: 'Validation',
    endpoint: 'POST /assignments',
    testFunction: 'tests/test_assignments.py::test_title_min_length_3',
    status: 'Passed',
    durationMs: 36,
    isRegressionGap: false,
  },
  {
    id: 'TEST-14',
    scenario: 'List all assignments without filter parameter',
    category: 'Functional behavior',
    endpoint: 'GET /assignments',
    testFunction: 'tests/test_assignments.py::test_list_all_assignments',
    status: 'Passed',
    durationMs: 45,
    isRegressionGap: false,
  },
  {
    id: 'TEST-15',
    scenario: 'Retrieve assignment by ID returns HTTP 200',
    category: 'Functional behavior',
    endpoint: 'GET /assignments/{id}',
    testFunction: 'tests/test_assignments.py::test_get_assignment_by_id',
    status: 'Passed',
    durationMs: 41,
    isRegressionGap: false,
  },
  {
    id: 'TEST-16',
    scenario: 'GET unknown assignment ID returns HTTP 404',
    category: 'Error handling',
    endpoint: 'GET /assignments/{id}',
    testFunction: 'tests/test_assignments.py::test_get_unknown_assignment_404',
    status: 'Passed',
    durationMs: 34,
    isRegressionGap: false,
  },
  {
    id: 'TEST-17',
    scenario: 'Submission requires non-empty studentName',
    category: 'Validation',
    endpoint: 'POST /submissions',
    testFunction: 'tests/test_submissions.py::test_student_name_required',
    status: 'Passed',
    durationMs: 38,
    isRegressionGap: false,
  },
  {
    id: 'TEST-18',
    scenario: 'HTTP 201 Created on valid submission',
    category: 'API contract',
    endpoint: 'POST /submissions',
    testFunction: 'tests/test_submissions.py::test_submission_success_status_code',
    status: 'Passed',
    durationMs: 47,
    isRegressionGap: false,
  },
];

export const REQUIREMENTS_DOC_MARKDOWN = `# Student Assignment Tracker API Requirements

## API Error Format
All errors must return:
\`\`\`json
{
  "error": "descriptive error message"
}
\`\`\`

## Create Assignment
\`POST /assignments\`

Rules:
- \`title\` is required and minimum 3 characters.
- \`courseCode\` is required and cannot be empty.
- \`dueDate\` must be a valid date.
- \`maxMarks\` must be between 1 and 100.
- Success response: HTTP 201.
- Validation error: HTTP 400.

## List Assignments
\`GET /assignments\`

Rules:
- Return all assignments without a filter.
- Support optional \`courseCode\` filter.
- Filtering must be case-insensitive.

## Get Assignment
\`GET /assignments/{assignment_id}\`

Rules:
- Return assignment when available.
- Return HTTP 404 when missing.

## Create Submission
\`POST /submissions\`

Rules:
- \`assignmentId\` must refer to an existing assignment.
- \`studentName\` is required.
- Submission on or before due date is allowed.
- Submission after due date is rejected.
- Late submission error:
\`\`\`json
{
  "error": "Late submissions are not allowed"
}
\`\`\`

## Required Test Coverage
- Required course code
- Empty course code
- Marks below 1
- Marks above 100
- Course filtering
- Case-insensitive filtering
- Late submission
- Missing assignment ID
- Error response format
`;

export const REPORT_BEFORE_MARKDOWN = `# Compliance Report — Before

## Baseline
- Existing test suite: 15/15 passed.
- Existing happy-path coverage was present.
- Three additional coverage gaps were identified.

## Original Requirement Violations
- \`courseCode\` was optional.
- \`maxMarks\` accepted values above 100.
- Course filtering was ignored.
- Late submissions were accepted.

## Coverage Gaps Identified
- Empty \`courseCode\` rejection.
- \`maxMarks\` lower than 1 rejection.
- Case-insensitive \`courseCode\` filtering.
`;

export const REPORT_AFTER_MARKDOWN = `# Compliance Report — After

## Final Validation
- Final test suite: 18/18 passed.
- Three regression tests were added.
- All required scenarios are covered.

## Verified Requirements
- \`courseCode\` is required and non-empty.
- \`maxMarks\` is restricted to 1–100.
- Course filtering works correctly.
- Course filtering ignores uppercase/lowercase differences.
- Late submissions are rejected.
- API errors use:
\`\`\`json
{
  "error": "message"
}
\`\`\`

## Impact
- Requirement-to-test traceability improved.
- Regression risk reduced.
- Manual review effort reduced.
- Compliance evidence available for QA and reviewers.
`;

export const AGENT_WORKFLOW_STEPS = [
  {
    role: 'Requirements Analyst',
    badge: 'Stage 01',
    description: 'Extracts endpoints, field rules, validation conditions, and business requirements from formal specification documents.',
    output: 'Structured requirements matrix & acceptance criteria',
  },
  {
    role: 'Code Auditor',
    badge: 'Stage 02',
    description: 'Compares implemented API behavior with documented requirements, identifying discrepancies and unhandled constraints.',
    output: 'Behavioral discrepancy report & edge case inventory',
  },
  {
    role: 'Test Engineer',
    badge: 'Stage 03',
    description: 'Finds missing coverage and writes automated regression tests targeting edge cases and boundary thresholds.',
    output: 'Executable pytest suites & synthetic fixtures',
  },
  {
    role: 'Fix Agent',
    badge: 'Stage 04',
    description: 'Applies minimal approved fixes when a test confirms a violation, ensuring no unintended regressions in surrounding code.',
    output: 'Targeted code patches & normalized schemas',
  },
  {
    role: 'Report Writer',
    badge: 'Stage 05',
    description: 'Creates before-and-after compliance reports with verified requirement-to-test traceability and attestation records.',
    output: 'Auditable compliance diffs & verification artifacts',
  },
];

export const REAL_WORLD_USE_CASES = [
  {
    domain: 'College ERP',
    rule: 'Reject late assignment submissions.',
    impact: 'Enforces academic integrity policies consistently without instructor manual timestamp audits.',
  },
  {
    domain: 'Banking',
    rule: 'Enforce transfer limits.',
    impact: 'Blocks transactions exceeding statutory thresholds before fund clearing, preventing regulatory fines.',
  },
  {
    domain: 'E-commerce',
    rule: 'Block expired coupons.',
    impact: 'Prevents checkout exploitation and revenue leakage across seasonal discount campaigns.',
  },
  {
    domain: 'Healthcare',
    rule: 'Validate mandatory patient identifiers.',
    impact: 'Ensures strict HIPAA / EHR compliance before electronic records are ingested or transmitted.',
  },
  {
    domain: 'Telecom',
    rule: 'Verify user plan eligibility.',
    impact: 'Eliminates unauthorized provisioning of 5G / roaming add-ons on legacy rate plans.',
  },
];
