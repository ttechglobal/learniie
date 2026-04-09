-- ============================================================
-- LearnInByte — Full database schema
-- Run this in the Supabase SQL Editor (one block at a time)
-- ============================================================

-- Enable trigram extension for school fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;


-- ── Schools ─────────────────────────────────────────────────
CREATE TABLE schools (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_name TEXT NOT NULL UNIQUE,
  student_count  INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "schools: public read" ON schools FOR SELECT USING (true);


-- ── Students ─────────────────────────────────────────────────
CREATE TABLE students (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT NOT NULL,
  class_level   TEXT CHECK (class_level IN ('JSS1','JSS2','JSS3','SS1','SS2','SS3')),
  department    TEXT CHECK (department IN ('Science','Arts','Commercial')),
  mode          TEXT NOT NULL DEFAULT 'school'
                  CHECK (mode IN ('school','exam','school_exam')),
  school_id     UUID REFERENCES schools(id),
  mascot        TEXT NOT NULL DEFAULT 'ade',
  xp            INTEGER NOT NULL DEFAULT 0,
  weekly_xp     INTEGER NOT NULL DEFAULT 0,
  monthly_xp    INTEGER NOT NULL DEFAULT 0,
  streak_days   INTEGER NOT NULL DEFAULT 0,
  lessons_done  INTEGER NOT NULL DEFAULT 0,
  questions_done INTEGER NOT NULL DEFAULT 0,
  last_active   DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "students: own row" ON students FOR ALL USING (auth.uid() = id);


-- ── Exam bodies ───────────────────────────────────────────────
CREATE TABLE exam_bodies (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code      TEXT NOT NULL UNIQUE, -- e.g. 'WAEC', 'JAMB'
  name      TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO exam_bodies (code, name) VALUES
  ('WAEC', 'West African Senior School Certificate Examination'),
  ('JAMB', 'Joint Admissions and Matriculation Board'),
  ('BECE', 'Basic Education Certificate Examination'),
  ('NECO', 'National Examinations Council');


-- ── Student exam enrolments ───────────────────────────────────
CREATE TABLE student_exams (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exam_body_id  UUID REFERENCES exam_bodies(id),
  exam_code     TEXT NOT NULL,
  target_date   DATE,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','dropped')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE student_exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "student_exams: own rows" ON student_exams FOR ALL USING (auth.uid() = student_id);


-- ── Subjects ──────────────────────────────────────────────────
CREATE TABLE subjects (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       TEXT NOT NULL UNIQUE,
  name       TEXT NOT NULL,
  emoji      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subjects: public read" ON subjects FOR SELECT USING (true);


-- ── Student subject enrolment ─────────────────────────────────
CREATE TABLE student_subjects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id       UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id       UUID NOT NULL REFERENCES subjects(id),
  progress_percent INTEGER NOT NULL DEFAULT 0,
  UNIQUE (student_id, subject_id)
);

ALTER TABLE student_subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "student_subjects: own rows" ON student_subjects FOR ALL USING (auth.uid() = student_id);


-- ── Topics ────────────────────────────────────────────────────
CREATE TABLE topics (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id  UUID NOT NULL REFERENCES subjects(id),
  slug        TEXT NOT NULL,
  title       TEXT NOT NULL,
  position    INTEGER NOT NULL DEFAULT 0,
  term        INTEGER NOT NULL DEFAULT 1 CHECK (term IN (1,2,3)),
  class_level TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (subject_id, slug)
);

ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "topics: public read" ON topics FOR SELECT USING (true);


-- ── Student topic progress ────────────────────────────────────
CREATE TABLE student_topic_progress (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id           UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  topic_id             UUID NOT NULL REFERENCES topics(id),
  lessons_completed    INTEGER NOT NULL DEFAULT 0,
  total_lessons        INTEGER NOT NULL DEFAULT 0,
  questions_correct    INTEGER NOT NULL DEFAULT 0,
  questions_attempted  INTEGER NOT NULL DEFAULT 0,
  accuracy_rate        NUMERIC(4,3) NOT NULL DEFAULT 0,
  preparedness_score   INTEGER NOT NULL DEFAULT 0,
  UNIQUE (student_id, topic_id)
);

ALTER TABLE student_topic_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "topic_progress: own rows" ON student_topic_progress FOR ALL USING (auth.uid() = student_id);


-- ── Lessons ───────────────────────────────────────────────────
CREATE TABLE lessons (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id                 UUID NOT NULL REFERENCES topics(id),
  title                    TEXT,
  position                 INTEGER NOT NULL DEFAULT 0,
  generation_status        TEXT NOT NULL DEFAULT 'pending'
                             CHECK (generation_status IN ('pending','generated','review_pending','published')),
  generation_model         TEXT,
  generation_tokens_used   INTEGER,
  generation_prompt_version TEXT,
  generated_at             TIMESTAMPTZ,
  review_notes             TEXT,
  image_prompts            JSONB,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lessons: public read published" ON lessons FOR SELECT USING (generation_status = 'published');


-- ── Lesson bites ──────────────────────────────────────────────
CREATE TABLE lesson_bites (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id    UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  bite_type    TEXT NOT NULL,
  content_json JSONB NOT NULL,
  order_index  INTEGER NOT NULL DEFAULT 0,
  is_required  BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE lesson_bites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lesson_bites: public read" ON lesson_bites FOR SELECT USING (true);


-- ── Lesson questions (embedded, 2 easy + 1 medium per lesson) ─
CREATE TABLE lesson_questions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id    UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  difficulty   TEXT NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  content_json JSONB NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE lesson_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lesson_questions: public read" ON lesson_questions FOR SELECT USING (true);


-- ── Practice questions (past exam questions) ──────────────────
CREATE TABLE practice_questions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id     UUID NOT NULL REFERENCES topics(id),
  exam_code    TEXT,
  exam_year    INTEGER,
  question_num INTEGER,
  difficulty   TEXT NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  content_json JSONB NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE practice_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "practice_questions: public read" ON practice_questions FOR SELECT USING (true);


-- ── Student lesson completions ────────────────────────────────
CREATE TABLE student_lesson_completions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  lesson_id   UUID NOT NULL REFERENCES lessons(id),
  xp_earned   INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, lesson_id)
);

ALTER TABLE student_lesson_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lesson_completions: own rows" ON student_lesson_completions FOR ALL USING (auth.uid() = student_id);


-- ── Leaderboard snapshots (hourly pre-computed) ───────────────
CREATE TABLE leaderboard_snapshots (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_type TEXT NOT NULL,
  period        TEXT NOT NULL CHECK (period IN ('weekly','monthly','all_time')),
  context_key   TEXT NOT NULL,
  student_id    UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  rank          INTEGER NOT NULL,
  score         INTEGER NOT NULL DEFAULT 0,
  display_name  TEXT,
  class_level   TEXT,
  computed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_snapshots_context_period ON leaderboard_snapshots (context_key, period);

ALTER TABLE leaderboard_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "snapshots: public read" ON leaderboard_snapshots FOR SELECT USING (true);


-- ── Academic calendar ─────────────────────────────────────────
CREATE TABLE academic_calendar (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term                   INTEGER NOT NULL CHECK (term IN (1,2,3)),
  term_start_date        DATE NOT NULL,
  term_end_date          DATE NOT NULL,
  mock_test_prompt_week  INTEGER NOT NULL DEFAULT 4,
  mock_test_target_week  INTEGER NOT NULL DEFAULT 6,
  mock_exam_prompt_week  INTEGER NOT NULL DEFAULT 9,
  mock_exam_target_week  INTEGER NOT NULL DEFAULT 11,
  is_active              BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE academic_calendar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "calendar: public read" ON academic_calendar FOR SELECT USING (true);


-- ── Fuzzy school matching function (requires pg_trgm) ─────────
CREATE OR REPLACE FUNCTION find_similar_schools(
  input_name TEXT,
  similarity_threshold FLOAT DEFAULT 0.3
)
RETURNS TABLE(id UUID, canonical_name TEXT, similarity FLOAT) AS $$
  SELECT id, canonical_name, similarity(canonical_name, input_name) AS similarity
  FROM schools
  WHERE similarity(canonical_name, input_name) > similarity_threshold
  ORDER BY similarity DESC
  LIMIT 5;
$$ LANGUAGE sql;
