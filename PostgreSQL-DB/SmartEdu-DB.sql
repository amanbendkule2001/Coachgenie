CREATE TABLE IF NOT EXISTS users(
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	full_name VARCHAR(255) NOT NULL,
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash TEXT NOT NULL,
	role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'tutor', 'parent', 'student')),
	is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- INSERT INTO users(full_name, email, password_hash, role)
-- VALUES ('Lokesh', 'lokesh@email.com', 'hashedpassword123', 'admin');

-- SELECT * FROM users;

CREATE TABLE IF NOT EXISTS user_profile(
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	phone VARCHAR(20),
	profile_photo TEXT,
	date_of_birth DATE,
	gender VARCHAR(20),
	address TEXT
);

-- INSERT INTO user_profile (user_id, phone)
-- VALUES ('1c5137c1-f002-41ee-9cfa-2f9f99a94c50', '7559251578')

-- SELECT * FROM users;
-- SELECT * FROM user_profile;

CREATE TABLE IF NOT EXISTS parent_student_map(
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

	parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

	relationship_type VARCHAR(20),

	UNIQUE (parent_id, student_id)
);

-- SELECT * FROM users;

-- INSERT INTO users(full_name, email, password_hash, role)
-- VALUES ('Mayur', 'mayur12@gmail.com', 'hashedmayur123', 'student');
-- INSERT INTO users(full_name, email, password_hash, role)
-- VALUES ('Yash', 'yash112@gmail.com', 'hashedyash123', 'parent');

-- SELECT id, role FROM users;

-- INSERT INTO parent_student_map (parent_id, student_id, relationship_type)
-- VALUES ('51ed86c9-c383-48bf-94e5-237368f25daf', '2dadf2fc-958b-4b6c-a0d5-626d15c58b76', 'father');

-- SELECT * FROM parent_student_map;

CREATE TABLE IF NOT EXISTS boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(20) UNIQUE NOT NULL,
    start_date DATE,
    end_date DATE
);

-- =====================================================
-- SCHOOL ORGANIZATION DOMAIN
-- =====================================================

CREATE TABLE IF NOT EXISTS school_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,  -- Primary | Secondary | Higher Secondary
    description TEXT
);

CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    level_id UUID NOT NULL
        REFERENCES school_levels(id) ON DELETE CASCADE,
    board_id UUID NOT NULL
        REFERENCES boards(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE (name, board_id)
);

-- SAME PREVIOUS CODE CONTINUES

CREATE TABLE IF NOT EXISTS grades(
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
	name VARCHAR(50) UNIQUE NOT NULL,
	UNIQUE (board_id, name)
);

CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    UNIQUE (subject_id, name)
);

CREATE TABLE IF NOT EXISTS curriculum_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    is_optional BOOLEAN DEFAULT FALSE,
    UNIQUE (grade_id, subject_id, academic_year_id)
);

-- NEW CODE FOR STUDENT'S SCHOOL ENROLLMENT & FOR SUBJECTS

CREATE TABLE IF NOT EXISTS student_school_enrollment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    school_id UUID NOT NULL
        REFERENCES schools(id) ON DELETE CASCADE,

    grade_id UUID NOT NULL
        REFERENCES grades(id) ON DELETE CASCADE,

    academic_year_id UUID NOT NULL
        REFERENCES academic_years(id) ON DELETE CASCADE,

    status VARCHAR(50),  -- Active | Completed | Transferred | Dropped
	start_date DATE,
	end_date DATE,
    description TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE (student_id, academic_year_id)
);

CREATE TABLE IF NOT EXISTS student_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    enrollment_id UUID NOT NULL
        REFERENCES student_school_enrollment(id) ON DELETE CASCADE,

    subject_id UUID NOT NULL
        REFERENCES subjects(id) ON DELETE CASCADE,

    UNIQUE (enrollment_id, subject_id)
);

-- SAME PREVIOUS CODE CONTINUES

CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    tutor_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    subject_id UUID NOT NULL
        REFERENCES subjects(id) ON DELETE CASCADE,

    session_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),

    session_status VARCHAR(20) NOT NULL
        CHECK (session_status IN ('scheduled', 'completed', 'cancelled')),

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_student ON sessions(student_id);
CREATE INDEX idx_sessions_tutor ON sessions(tutor_id);
CREATE INDEX idx_sessions_subject ON sessions(subject_id);
CREATE INDEX idx_sessions_date ON sessions(session_date);

CREATE TABLE IF NOT EXISTS session_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    session_id UUID NOT NULL
        REFERENCES sessions(id) ON DELETE CASCADE,

    notes_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_session_notes_session ON session_notes(session_id);

CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    subject_id UUID NOT NULL
        REFERENCES subjects(id) ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,
    description TEXT,

    due_date DATE NOT NULL,

    status VARCHAR(20) NOT NULL
        CHECK (status IN ('pending', 'submitted', 'reviewed')),

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE (student_id, subject_id, title)
);

CREATE INDEX idx_assignments_student ON assignments(student_id);
CREATE INDEX idx_assignments_subject ON assignments(subject_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);

CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    subject_id UUID NOT NULL
        REFERENCES subjects(id) ON DELETE CASCADE,

    topic_id UUID NOT NULL
        REFERENCES topics(id) ON DELETE CASCADE,

    session_id UUID
        REFERENCES sessions(id) ON DELETE SET NULL,

    score NUMERIC(5,2) NOT NULL CHECK (score >= 0),
    max_score NUMERIC(5,2) NOT NULL CHECK (max_score > 0),

    assessment_type VARCHAR(20) NOT NULL
        CHECK (assessment_type IN ('quiz', 'test', 'practice')),

    created_at TIMESTAMP DEFAULT NOW(),

    CHECK (score <= max_score)
);

CREATE INDEX idx_assessments_student ON assessments(student_id);
CREATE INDEX idx_assessments_subject ON assessments(subject_id);
CREATE INDEX idx_assessments_topic ON assessments(topic_id);
CREATE INDEX idx_assessments_created ON assessments(created_at);

CREATE TABLE IF NOT EXISTS skill_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    communication_score NUMERIC(5,2) CHECK (communication_score BETWEEN 0 AND 100),
    confidence_score NUMERIC(5,2) CHECK (confidence_score BETWEEN 0 AND 100),
    engagement_score NUMERIC(5,2) CHECK (engagement_score BETWEEN 0 AND 100),
    problem_solving_score NUMERIC(5,2) CHECK (problem_solving_score BETWEEN 0 AND 100),

    evaluated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_skill_metrics_student ON skill_metrics(student_id);
CREATE INDEX idx_skill_metrics_date ON skill_metrics(evaluated_at);

CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    report_type VARCHAR(30) NOT NULL
        CHECK (report_type IN ('weekly', 'monthly', 'custom')),

    report_json JSONB NOT NULL,

    generated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_student ON reports(student_id);
CREATE INDEX idx_reports_generated ON reports(generated_at);

CREATE TABLE IF NOT EXISTS ai_feedback_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    prompt_used TEXT NOT NULL,
    ai_response TEXT NOT NULL,

    tokens_used INTEGER CHECK (tokens_used >= 0),

    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_logs_student ON ai_feedback_logs(student_id);
CREATE INDEX idx_ai_logs_created ON ai_feedback_logs(created_at);

CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    student_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    recommendation_text TEXT NOT NULL,

    source VARCHAR(20) NOT NULL
        CHECK (source IN ('AI', 'rule_engine')),

    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recommendations_student ON recommendations(student_id);
CREATE INDEX idx_recommendations_created ON recommendations(created_at);

CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    action_type VARCHAR(100) NOT NULL,

    metadata_json JSONB,

    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_time ON activity_logs(timestamp);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,

    change_type VARCHAR(10) NOT NULL
        CHECK (change_type IN ('insert', 'update', 'delete')),

    changed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_table ON audit_logs(table_name);
CREATE INDEX idx_audit_time ON audit_logs(changed_at);

SELECT * FROM users;
SELECT * FROM parent_student_map;