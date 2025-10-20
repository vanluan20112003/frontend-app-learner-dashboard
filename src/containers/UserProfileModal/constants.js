// User profile types
export const USER_TYPES = {
  STUDENT: 'student',
  PROFESSIONAL: 'professional',
  TEACHER: 'teacher',
};

// Education levels for students
export const EDUCATION_LEVELS = {
  BACHELOR: 'bachelor',
  MASTER: 'master',
  OTHER: 'other',
};

// Academic years for bachelor students
export const ACADEMIC_YEARS = {
  YEAR_1: '1',
  YEAR_2: '2',
  YEAR_3: '3',
  YEAR_4_PLUS: '4+',
};

// Gender options
export const GENDERS = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
};

// GPA self-assessment levels
export const GPA_LEVELS = {
  WEAK: 'weak',
  AVERAGE: 'average',
  GOOD: 'good',
  EXCELLENT: 'excellent',
};

// Fields of interest
export const FIELDS_OF_INTEREST = [
  { value: 'economics', label: 'Economics' },
  { value: 'law', label: 'Law' },
  { value: 'politics', label: 'Politics' },
  { value: 'data', label: 'Data Science' },
  { value: 'languages', label: 'Languages' },
  { value: 'it', label: 'Information Technology' },
  { value: 'business', label: 'Business' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'arts', label: 'Arts & Humanities' },
];

// Short-term goals for students
export const STUDENT_GOALS = [
  { value: 'increase_gpa', label: 'Increase GPA' },
  { value: 'catch_up_graduation', label: 'Catch up with graduation timeline' },
  { value: 'explore_new_major', label: 'Explore new major/field' },
  { value: 'prepare_internship', label: 'Prepare for internship/job' },
];

// Goals for professionals
export const PROFESSIONAL_GOALS = [
  { value: 'career_change', label: 'Career change (e.g., to Data/AI)' },
  { value: 'level_up', label: 'Level up (Junior → Mid / Mid → Senior / Lead)' },
  { value: 'certification', label: 'Get professional certification (AWS, PMP, CFA, etc.)' },
  { value: 'soft_skills', label: 'Learn soft skills (presentation, project management, etc.)' },
];

// Age groups
export const AGE_GROUPS = [
  { value: 'under_18', label: 'Under 18' },
  { value: '18_24', label: '18-24' },
  { value: '25_34', label: '25-34' },
  { value: '35_44', label: '35-44' },
  { value: '45_54', label: '45-54' },
  { value: '55_plus', label: '55+' },
];

// Form steps
export const FORM_STEPS = {
  USER_TYPE: 'userType',
  BASIC_INFO: 'basicInfo',
  INTERESTS: 'interests',
  GOALS: 'goals',
  DEMOGRAPHICS: 'demographics',
};

// Validation rules
export const VALIDATION = {
  MIN_INTERESTS: 1,
  MIN_GOALS: 1,
};
