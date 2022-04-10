CREATE TABLE IF NOT EXISTS mods(
    course_code TEXT,
    course_name TEXT NOT NULL,
    AU FLOAT NOT NULL,
    course_index TEXT NOT NULL,
    type TEXT,
    course_group TEXT,
    lesson_day TEXT,
    lesson_time TEXT,
    venue TEXT,
    remarks
);