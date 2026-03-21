-- -- Required for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================
-- ORGANIZATIONS
-- =====================================

CREATE TABLE organizations (
    org_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================
-- TUTORS
-- =====================================

CREATE TABLE tutors (
    tutor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(org_id),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    mobile_number VARCHAR(13) UNIQUE NOT NULL 
        CHECK (mobile_number ~ '^\+91[6-9][0-9]{9}$'),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================
-- BOARDS
-- =====================================

CREATE TABLE boards (
    board_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_name VARCHAR(100) UNIQUE NOT NULL
);

-- =====================================
-- STANDARDS
-- =====================================

CREATE TABLE standards (
    std_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES boards(board_id) ON DELETE CASCADE,
    std_name VARCHAR(50) NOT NULL
);

-- =====================================
-- SUBJECTS
-- =====================================

CREATE TABLE subjects (
    subject_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    std_id UUID NOT NULL REFERENCES standards(std_id) ON DELETE CASCADE,
    subject_name VARCHAR(255) NOT NULL
);

-- =====================================
-- STUDENTS
-- =====================================

CREATE TABLE students (
    student_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id UUID NOT NULL REFERENCES tutors(tutor_id) ON DELETE CASCADE,
    org_id UUID REFERENCES organizations(org_id),
    std_id UUID REFERENCES standards(std_id),
    student_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(13) UNIQUE NOT NULL 
        CHECK (mobile_number ~ '^\+91[6-9][0-9]{9}$'),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================
-- COURSES
-- =====================================

CREATE TABLE courses (
    course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id UUID NOT NULL REFERENCES tutors(tutor_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2),
    duration_months INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================
-- BATCHES
-- =====================================

CREATE TABLE batches (
    batch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    batch_name VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE
);

-- =====================================
-- ENROLLMENTS
-- =====================================

CREATE TABLE enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES batches(batch_id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_enrollment UNIQUE (student_id, batch_id)
);

-- =====================================
-- TIMETABLE
-- =====================================

CREATE TYPE weekday AS ENUM (
    'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'
);

CREATE TABLE timetable (
    timetable_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES batches(batch_id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(subject_id),
    weekday weekday NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

-- =====================================
-- MATERIALS
-- =====================================

CREATE TABLE materials (
    material_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES subjects(subject_id),
    batch_id UUID REFERENCES batches(batch_id),
    title VARCHAR(255) NOT NULL,
    material_type VARCHAR(50),
    file_url TEXT,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- =====================================
-- TESTS
-- =====================================

CREATE TABLE tests (
    test_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES batches(batch_id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(subject_id),
    test_date DATE NOT NULL,
    max_marks INTEGER DEFAULT 100
);

-- =====================================
-- MARKS
-- =====================================

CREATE TABLE marks (
    marks_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES tests(test_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0),
    CONSTRAINT unique_marks UNIQUE (test_id, student_id)
);

-- =====================================
-- RANKINGS
-- =====================================

CREATE TABLE rankings (
    ranking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID REFERENCES tests(test_id),
    student_id UUID REFERENCES students(student_id),
    rank INTEGER,
    percentile NUMERIC(5,2)
);

-- =====================================
-- AI REPORTS
-- =====================================

CREATE TABLE ai_reports (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(student_id),
    report_type VARCHAR(50),
    report_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================
-- FEES
-- =====================================

CREATE TABLE fees (
    fee_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(student_id),
    course_id UUID REFERENCES courses(course_id),
    amount NUMERIC(10,2) NOT NULL,
    total_paid NUMERIC(10,2) DEFAULT 0,
    remaining_amount NUMERIC(10,2),
    due_date DATE NOT NULL,
    status VARCHAR(50) CHECK (status IN ('Paid','Pending'))
);

-- =====================================
-- PAYMENTS
-- =====================================

CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fee_id UUID NOT NULL REFERENCES fees(fee_id),
    payment_date DATE,
    amount_paid NUMERIC(10,2),
    payment_method VARCHAR(50)
);

-- =====================================
-- RECEIPTS
-- =====================================

CREATE TABLE fee_receipts (
    receipt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES payments(payment_id) ON DELETE CASCADE,
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    issued_at TIMESTAMP DEFAULT NOW(),
    generated_by UUID REFERENCES tutors(tutor_id),
    notes TEXT
);

-- =====================================
-- ENQUIRIES
-- =====================================

CREATE TABLE enquiries (
    enquiry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    mobile_number VARCHAR(13) UNIQUE NOT NULL 
        CHECK (mobile_number ~ '^\+91[6-9][0-9]{9}$'),
    subject VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================
-- FOLLOWUPS
-- =====================================

CREATE TABLE followups (
    followup_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enquiry_id UUID NOT NULL REFERENCES enquiries(enquiry_id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES tutors(tutor_id),
    call_date DATE,
    status VARCHAR(50) CHECK (status IN ('Converted','Pending','Interested','Called_once'))
);

-- =====================================
-- TODO
-- =====================================

CREATE TABLE todo (
    todo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id UUID REFERENCES tutors(tutor_id),
    task TEXT,
    task_date DATE,
    status VARCHAR(50) CHECK (status IN ('Done','Pending'))
);

-- =====================================
-- ACTIVITIES
-- =====================================

CREATE TABLE activities (
    activity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES batches(batch_id),
    description TEXT,
    activity_date DATE
);

-- =====================================
-- CERTIFICATES
-- =====================================

CREATE TABLE certificates (
    certificate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(student_id),
    course_id UUID REFERENCES courses(course_id),
    issue_date DATE DEFAULT NOW()
);

-- =====================================
-- HOLIDAYS
-- =====================================

CREATE TABLE holidays (
    holiday_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    holiday_date DATE NOT NULL,
    description TEXT
);

-- =====================================
-- INDEXES
-- =====================================

CREATE UNIQUE INDEX idx_tutor_email_lower ON tutors (LOWER(email));
CREATE INDEX idx_students_tutor ON students(tutor_id);
CREATE INDEX idx_students_std ON students(std_id);
CREATE INDEX idx_batches_course ON batches(course_id);
CREATE INDEX idx_tests_batch ON tests(batch_id);
CREATE INDEX idx_tests_subject ON tests(subject_id);
CREATE INDEX idx_marks_student ON marks(student_id);
CREATE INDEX idx_materials_subject ON materials(subject_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_payments_fee ON payments(fee_id);

-- =====================================
-- ADDING DATA INTO THE DB
-- =====================================

--- ORGANIZATION DATA

INSERT INTO organizations (org_name)
VALUES ('SmartEdu Solo Tutors');

SELECT * FROM organizations;

-- TUTORS DATA

INSERT INTO tutors (org_id, full_name, email, password_hash, mobile_number)
VALUES 
(
    (SELECT org_id FROM organizations WHERE org_name='SmartEdu Solo Tutors'),
    'Amit Sharma', 'amit@gmail.com', 'hashed_pass', '+919876543210'
),
(
    (SELECT org_id FROM organizations WHERE org_name='SmartEdu Solo Tutors'),
    'Neha Verma', 'neha@gmail.com', 'hashed_pass', '+919876543211'
);

SELECT * FROM tutors;

--- BOARDS DATA

INSERT INTO boards (board_name)
VALUES ('CBSE'), ('ICSE'), ('State Board');

SELECT * FROM boards;

--- STANDARDS DATA

INSERT INTO standards (board_id, std_name)
VALUES
((SELECT board_id FROM boards WHERE board_name='CBSE'), '8'),
((SELECT board_id FROM boards WHERE board_name='CBSE'), '9'),
((SELECT board_id FROM boards WHERE board_name='CBSE'), '10');

SELECT * FROM standards;

--- SUBJECTS DATA

INSERT INTO subjects (std_id, subject_name)
VALUES
((SELECT std_id FROM standards WHERE std_name='8'), 'Mathematics'),
((SELECT std_id FROM standards WHERE std_name='8'), 'Science'),
((SELECT std_id FROM standards WHERE std_name='9'), 'Mathematics'),
((SELECT std_id FROM standards WHERE std_name='10'), 'Physics');

SELECT * FROM subjects;

--- STUDENTS DATA

INSERT INTO students (tutor_id, org_id, std_id, student_name, mobile_number, email)
VALUES
((SELECT tutor_id FROM tutors WHERE full_name='Amit Sharma'),
 (SELECT org_id FROM organizations WHERE org_name='SmartEdu Solo Tutors'),
 (SELECT std_id FROM standards WHERE std_name='8'),
 'Rahul Singh', '+919876543220', 'rahul@gmail.com'),

((SELECT tutor_id FROM tutors WHERE full_name='Amit Sharma'),
 (SELECT org_id FROM organizations WHERE org_name='SmartEdu Solo Tutors'),
 (SELECT std_id FROM standards WHERE std_name='9'),
 'Rohit Sharma', '+919876543222', 'rohit@gmail.com'),

((SELECT tutor_id FROM tutors WHERE full_name='Neha Verma'),
 (SELECT org_id FROM organizations WHERE org_name='SmartEdu Solo Tutors'),
 (SELECT std_id FROM standards WHERE std_name='10'),
 'Sneha Joshi', '+919876543225', 'sneha@gmail.com');

 SELECT * FROM students;

 --- COURSES DATA

 INSERT INTO courses (tutor_id, title, description, price, duration_months)
VALUES
((SELECT tutor_id FROM tutors WHERE full_name='Amit Sharma'),
 'Class 8 Maths', 'Foundation Maths', 2000, 6),

((SELECT tutor_id FROM tutors WHERE full_name='Neha Verma'),
 'Class 10 Physics', 'Board Prep', 3000, 6);

 SELECT * FROM courses;

 --- BATCHES DATA

 INSERT INTO batches (course_id, batch_name, start_date, end_date)
VALUES
((SELECT course_id FROM courses WHERE title='Class 8 Maths'),
 'Batch A', DATE '2026-04-01', DATE '2026-10-01'),

((SELECT course_id FROM courses WHERE title='Class 10 Physics'),
 'Batch B', DATE '2026-04-01', DATE '2026-10-01');

 SELECT * FROM batches;

 --- ENROLLMENTS DATA

INSERT INTO enrollments (student_id, batch_id)
SELECT s.student_id, b.batch_id
FROM students s, batches b
LIMIT 3;

SELECT * FROM enrollments;

--- TESTS DATA

INSERT INTO tests (batch_id, subject_id, test_date)
VALUES
((SELECT batch_id FROM batches LIMIT 1),
 (SELECT subject_id FROM subjects LIMIT 1),
 DATE '2026-05-01');

 SELECT * FROM tests;

 --- MARKS DATA

 INSERT INTO marks (test_id, student_id, score)
SELECT 
    (SELECT test_id FROM tests LIMIT 1),
    student_id,
    80
FROM students
LIMIT 3;

SELECT * FROM marks;

--- AI REPORTS DATA

INSERT INTO ai_reports (student_id, report_type, report_data)
SELECT student_id, 'weekly',
'{"performance":"Good","weak_area":"Algebra"}'
FROM students
LIMIT 3;

SELECT * FROM ai_reports;

---

--- 29 Relations made in this DataBase.