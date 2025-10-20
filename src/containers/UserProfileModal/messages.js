import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  // Modal title
  modalTitle: {
    id: 'learner-dash.userProfile.modalTitle',
    description: 'Title for user profile collection modal',
    defaultMessage: 'Welcome! Let\'s personalize your learning experience',
  },

  // User type selection
  selectUserType: {
    id: 'learner-dash.userProfile.selectUserType',
    description: 'Header for user type selection',
    defaultMessage: 'What best describes you?',
  },
  userTypeStudent: {
    id: 'learner-dash.userProfile.userTypeStudent',
    description: 'Student user type option',
    defaultMessage: 'Student',
  },
  userTypeProfessional: {
    id: 'learner-dash.userProfile.userTypeProfessional',
    description: 'Professional user type option',
    defaultMessage: 'Professional / Other',
  },
  userTypeTeacher: {
    id: 'learner-dash.userProfile.userTypeTeacher',
    description: 'Teacher user type option',
    defaultMessage: 'Teacher',
  },

  // Student - Basic Info
  studentBasicInfo: {
    id: 'learner-dash.userProfile.studentBasicInfo',
    description: 'Header for student basic information',
    defaultMessage: 'Tell us about your studies',
  },
  schoolLabel: {
    id: 'learner-dash.userProfile.schoolLabel',
    description: 'Label for school input',
    defaultMessage: 'School/University',
  },
  schoolPlaceholder: {
    id: 'learner-dash.userProfile.schoolPlaceholder',
    description: 'Placeholder for school input',
    defaultMessage: 'Enter your school name',
  },
  facultyLabel: {
    id: 'learner-dash.userProfile.facultyLabel',
    description: 'Label for faculty input',
    defaultMessage: 'Faculty',
  },
  facultyPlaceholder: {
    id: 'learner-dash.userProfile.facultyPlaceholder',
    description: 'Placeholder for faculty input',
    defaultMessage: 'Enter your faculty',
  },
  majorLabel: {
    id: 'learner-dash.userProfile.majorLabel',
    description: 'Label for major input',
    defaultMessage: 'Major (optional)',
  },
  majorPlaceholder: {
    id: 'learner-dash.userProfile.majorPlaceholder',
    description: 'Placeholder for major input',
    defaultMessage: 'Enter your major',
  },
  educationLevelLabel: {
    id: 'learner-dash.userProfile.educationLevelLabel',
    description: 'Label for education level',
    defaultMessage: 'Education Level',
  },
  educationLevelBachelor: {
    id: 'learner-dash.userProfile.educationLevelBachelor',
    description: 'Bachelor education level',
    defaultMessage: 'Bachelor\'s Degree',
  },
  educationLevelMaster: {
    id: 'learner-dash.userProfile.educationLevelMaster',
    description: 'Master education level',
    defaultMessage: 'Master\'s Degree',
  },
  educationLevelOther: {
    id: 'learner-dash.userProfile.educationLevelOther',
    description: 'Other education level',
    defaultMessage: 'Other',
  },
  academicYearLabel: {
    id: 'learner-dash.userProfile.academicYearLabel',
    description: 'Label for academic year',
    defaultMessage: 'Academic Year',
  },
  yearOne: {
    id: 'learner-dash.userProfile.yearOne',
    description: 'Year 1',
    defaultMessage: 'Year 1',
  },
  yearTwo: {
    id: 'learner-dash.userProfile.yearTwo',
    description: 'Year 2',
    defaultMessage: 'Year 2',
  },
  yearThree: {
    id: 'learner-dash.userProfile.yearThree',
    description: 'Year 3',
    defaultMessage: 'Year 3',
  },
  yearFourPlus: {
    id: 'learner-dash.userProfile.yearFourPlus',
    description: 'Year 4+',
    defaultMessage: 'Year 4+',
  },
  genderLabel: {
    id: 'learner-dash.userProfile.genderLabel',
    description: 'Label for gender',
    defaultMessage: 'Gender',
  },
  genderMale: {
    id: 'learner-dash.userProfile.genderMale',
    description: 'Male gender option',
    defaultMessage: 'Male',
  },
  genderFemale: {
    id: 'learner-dash.userProfile.genderFemale',
    description: 'Female gender option',
    defaultMessage: 'Female',
  },
  genderOther: {
    id: 'learner-dash.userProfile.genderOther',
    description: 'Other gender option',
    defaultMessage: 'Other',
  },
  gpaLabel: {
    id: 'learner-dash.userProfile.gpaLabel',
    description: 'Label for GPA/self-assessment',
    defaultMessage: 'Current GPA / Self-Assessment (optional)',
  },
  gpaWeak: {
    id: 'learner-dash.userProfile.gpaWeak',
    description: 'Weak GPA level',
    defaultMessage: 'Weak',
  },
  gpaAverage: {
    id: 'learner-dash.userProfile.gpaAverage',
    description: 'Average GPA level',
    defaultMessage: 'Average',
  },
  gpaGood: {
    id: 'learner-dash.userProfile.gpaGood',
    description: 'Good GPA level',
    defaultMessage: 'Good',
  },
  gpaExcellent: {
    id: 'learner-dash.userProfile.gpaExcellent',
    description: 'Excellent GPA level',
    defaultMessage: 'Excellent',
  },

  // Interests
  interestsHeader: {
    id: 'learner-dash.userProfile.interestsHeader',
    description: 'Header for interests selection',
    defaultMessage: 'What are you interested in?',
  },
  interestsLabel: {
    id: 'learner-dash.userProfile.interestsLabel',
    description: 'Label for interests',
    defaultMessage: 'Fields of Interest (select at least 1)',
  },
  previousCoursesLabel: {
    id: 'learner-dash.userProfile.previousCoursesLabel',
    description: 'Label for previous courses',
    defaultMessage: 'Previous Courses/Subjects (optional)',
  },
  previousCoursesPlaceholder: {
    id: 'learner-dash.userProfile.previousCoursesPlaceholder',
    description: 'Placeholder for previous courses',
    defaultMessage: 'Enter course names, separated by commas',
  },

  // Goals
  goalsHeader: {
    id: 'learner-dash.userProfile.goalsHeader',
    description: 'Header for goals selection',
    defaultMessage: 'What are your goals?',
  },
  studentGoalsLabel: {
    id: 'learner-dash.userProfile.studentGoalsLabel',
    description: 'Label for student goals',
    defaultMessage: 'Short-term Goals for Next Term (select at least 1)',
  },
  professionalGoalsLabel: {
    id: 'learner-dash.userProfile.professionalGoalsLabel',
    description: 'Label for professional goals',
    defaultMessage: 'Main Goals (select at least 1)',
  },

  // Demographics
  demographicsHeader: {
    id: 'learner-dash.userProfile.demographicsHeader',
    description: 'Header for demographics',
    defaultMessage: 'Just a few more details',
  },
  ageGroupLabel: {
    id: 'learner-dash.userProfile.ageGroupLabel',
    description: 'Label for age group',
    defaultMessage: 'Age Group',
  },

  // Professional fields
  professionalBasicInfo: {
    id: 'learner-dash.userProfile.professionalBasicInfo',
    description: 'Header for professional basic information',
    defaultMessage: 'Tell us about yourself',
  },
  currentJobLabel: {
    id: 'learner-dash.userProfile.currentJobLabel',
    description: 'Label for current job',
    defaultMessage: 'Current Job/Profession',
  },
  currentJobPlaceholder: {
    id: 'learner-dash.userProfile.currentJobPlaceholder',
    description: 'Placeholder for current job',
    defaultMessage: 'Enter your current job title',
  },
  professionalFieldLabel: {
    id: 'learner-dash.userProfile.professionalFieldLabel',
    description: 'Label for professional field',
    defaultMessage: 'Field/Industry',
  },

  // Teacher fields
  teacherBasicInfo: {
    id: 'learner-dash.userProfile.teacherBasicInfo',
    description: 'Header for teacher basic information',
    defaultMessage: 'Tell us about your teaching',
  },
  teachingSubjectLabel: {
    id: 'learner-dash.userProfile.teachingSubjectLabel',
    description: 'Label for teaching subject',
    defaultMessage: 'Subject/Major You Teach',
  },
  teachingSubjectPlaceholder: {
    id: 'learner-dash.userProfile.teachingSubjectPlaceholder',
    description: 'Placeholder for teaching subject',
    defaultMessage: 'Enter subject or major',
  },
  teachingSchoolLabel: {
    id: 'learner-dash.userProfile.teachingSchoolLabel',
    description: 'Label for teaching school',
    defaultMessage: 'School/Institution',
  },

  // Buttons
  nextButton: {
    id: 'learner-dash.userProfile.nextButton',
    description: 'Next button text',
    defaultMessage: 'Next',
  },
  backButton: {
    id: 'learner-dash.userProfile.backButton',
    description: 'Back button text',
    defaultMessage: 'Back',
  },
  submitButton: {
    id: 'learner-dash.userProfile.submitButton',
    description: 'Submit button text',
    defaultMessage: 'Complete',
  },
  skipButton: {
    id: 'learner-dash.userProfile.skipButton',
    description: 'Skip button text',
    defaultMessage: 'Skip for now',
  },

  // Progress
  stepProgress: {
    id: 'learner-dash.userProfile.stepProgress',
    description: 'Step progress indicator',
    defaultMessage: 'Step {current} of {total}',
  },

  // Validation messages
  validationRequired: {
    id: 'learner-dash.userProfile.validationRequired',
    description: 'Required field validation',
    defaultMessage: 'This field is required',
  },
  validationMinInterests: {
    id: 'learner-dash.userProfile.validationMinInterests',
    description: 'Minimum interests validation',
    defaultMessage: 'Please select at least one field of interest',
  },
  validationMinGoals: {
    id: 'learner-dash.userProfile.validationMinGoals',
    description: 'Minimum goals validation',
    defaultMessage: 'Please select at least one goal',
  },
});

export default messages;
