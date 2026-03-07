-- =====================================
-- EXTENSIONS
-- =====================================

-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================
-- TUTORS
-- =====================================

CREATE TABLE tutors (
    tutor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================
-- BOARDS
-- =====================================

CREATE TABLE new_boards(
    board_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_name VARCHAR(100) UNIQUE NOT NULL
);

-- =====================================
-- STANDARDS (CLASSES)
-- =====================================

CREATE TABLE standards (
    std_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES new_boards(board_id) ON DELETE CASCADE,
    std_name VARCHAR(50) NOT NULL
);

-- =====================================
-- SUBJECTS
-- =====================================

CREATE TABLE new_subjects (
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
    board_id UUID REFERENCES new_boards(board_id),
    std_id UUID REFERENCES standards(std_id),
    student_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
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
    tutor_id UUID NOT NULL REFERENCES tutors(tutor_id) ON DELETE CASCADE,
    batch_name VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE
);

-- =====================================
-- ENROLLMENTS (STUDENT ↔ BATCH)
-- =====================================

CREATE TABLE enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    batch_id UUID NOT NULL REFERENCES batches(batch_id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT NOW()
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
    subject_id UUID NOT NULL REFERENCES new_subjects(subject_id),
    weekday weekday NOT NULL,
    class_time TIME NOT NULL
);

-- =====================================
-- STUDY MATERIALS
-- =====================================

CREATE TABLE materials (
    material_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES new_subjects(subject_id),
    title VARCHAR(255) NOT NULL,
    material_type VARCHAR(50), -- notes, video, recording
    file_url TEXT,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- =====================================
-- TESTS
-- =====================================

CREATE TABLE tests (
    test_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES batches(batch_id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES new_subjects(subject_id),
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
    score INTEGER NOT NULL CHECK (score >= 0)
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
-- AI ANALYTICS DATA
-- =====================================

CREATE TABLE ai_data (
    ai_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(student_id),
    predicted_score NUMERIC(5,2),
    predicted_rank INTEGER,
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
    due_date DATE NOT NULL,
    status VARCHAR(50) -- Paid / Pending
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
-- FEES RECEIPTS
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
-- ENQUIRIES (LEADS)
-- =====================================

CREATE TABLE enquiries (
    enquiry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    phone VARCHAR(20),
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
    status VARCHAR(50)
);

-- =====================================
-- TODO TASKS
-- =====================================

CREATE TABLE todo (
    todo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id UUID REFERENCES tutors(tutor_id),
    task TEXT,
    task_date DATE,
    status VARCHAR(50)
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
-- INDEXES (PERFORMANCE)
-- =====================================

CREATE INDEX idx_students_tutor ON students(tutor_id);
CREATE INDEX idx_marks_student ON marks(student_id);
CREATE INDEX idx_tests_batch ON tests(batch_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_payments_fee ON payments(fee_id);

SELECT * FROM tutors;