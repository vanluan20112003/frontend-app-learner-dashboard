// import { defineMessages } from '@edx/frontend-platform/i18n';

// const messages = defineMessages({
//   // Modal title
//   modalTitle: {
//     id: 'learner-dash.userProfile.modalTitle',
//     description: 'Title for user profile collection modal',
//     defaultMessage: 'Welcome! Let\'s personalize your learning experience',
//   },

//   // Welcome Step
//   welcomeTitle: {
//     id: 'userProfileModal.welcomeTitle',
//     defaultMessage: 'Welcome to Your Learning Journey!',
//     description: 'Welcome step title',
//   },
//   welcomeDescription: {
//     id: 'userProfileModal.welcomeDescription',
//     defaultMessage: 'Help us personalize your learning experience by answering a few quick questions about yourself.',
//     description: 'Welcome step description',
//   },
//   welcomeBenefit1Title: {
//     id: 'userProfileModal.welcomeBenefit1Title',
//     defaultMessage: 'Personalized Recommendations',
//     description: 'First benefit title',
//   },
//   welcomeBenefit1Description: {
//     id: 'userProfileModal.welcomeBenefit1Description',
//     defaultMessage: 'Get course suggestions tailored to your interests and goals.',
//     description: 'First benefit description',
//   },
//   welcomeBenefit2Title: {
//     id: 'userProfileModal.welcomeBenefit2Title',
//     defaultMessage: 'Better Learning Experience',
//     description: 'Second benefit title',
//   },
//   welcomeBenefit2Description: {
//     id: 'userProfileModal.welcomeBenefit2Description',
//     defaultMessage: 'We\'ll customize your dashboard to match your learning style.',
//     description: 'Second benefit description',
//   },
//   welcomeBenefit3Title: {
//     id: 'userProfileModal.welcomeBenefit3Title',
//     defaultMessage: 'Track Your Progress',
//     description: 'Third benefit title',
//   },
//   welcomeBenefit3Description: {
//     id: 'userProfileModal.welcomeBenefit3Description',
//     defaultMessage: 'Monitor your achievements and reach your educational goals.',
//     description: 'Third benefit description',
//   },
//   welcomeDisclaimer: {
//     id: 'userProfileModal.welcomeDisclaimer',
//     defaultMessage: 'This will only take a few minutes. You can always update your preferences later.',
//     description: 'Welcome disclaimer text',
//   },

//   // User type selection
//   selectUserType: {
//     id: 'learner-dash.userProfile.selectUserType',
//     description: 'Header for user type selection',
//     defaultMessage: 'What best describes you?',
//   },
//   userTypeStudent: {
//     id: 'learner-dash.userProfile.userTypeStudent',
//     description: 'Student user type option',
//     defaultMessage: 'Student',
//   },
//   userTypeProfessional: {
//     id: 'learner-dash.userProfile.userTypeProfessional',
//     description: 'Professional user type option',
//     defaultMessage: 'Professional / Other',
//   },
//   userTypeTeacher: {
//     id: 'learner-dash.userProfile.userTypeTeacher',
//     description: 'Teacher user type option',
//     defaultMessage: 'Teacher',
//   },

//   // Student - Basic Info
//   studentBasicInfo: {
//     id: 'learner-dash.userProfile.studentBasicInfo',
//     description: 'Header for student basic information',
//     defaultMessage: 'Tell us about your studies',
//   },
//   schoolLabel: {
//     id: 'learner-dash.userProfile.schoolLabel',
//     description: 'Label for school input',
//     defaultMessage: 'School/University',
//   },
//   schoolPlaceholder: {
//     id: 'learner-dash.userProfile.schoolPlaceholder',
//     description: 'Placeholder for school input',
//     defaultMessage: 'Enter your school name',
//   },
//   facultyLabel: {
//     id: 'learner-dash.userProfile.facultyLabel',
//     description: 'Label for faculty input',
//     defaultMessage: 'Faculty',
//   },
//   facultyPlaceholder: {
//     id: 'learner-dash.userProfile.facultyPlaceholder',
//     description: 'Placeholder for faculty input',
//     defaultMessage: 'Enter your faculty',
//   },
//   majorLabel: {
//     id: 'learner-dash.userProfile.majorLabel',
//     description: 'Label for major input',
//     defaultMessage: 'Major (optional)',
//   },
//   majorPlaceholder: {
//     id: 'learner-dash.userProfile.majorPlaceholder',
//     description: 'Placeholder for major input',
//     defaultMessage: 'Enter your major',
//   },
//   educationLevelLabel: {
//     id: 'learner-dash.userProfile.educationLevelLabel',
//     description: 'Label for education level',
//     defaultMessage: 'Education Level',
//   },
//   educationLevelBachelor: {
//     id: 'learner-dash.userProfile.educationLevelBachelor',
//     description: 'Bachelor education level',
//     defaultMessage: 'Bachelor\'s Degree',
//   },
//   educationLevelMaster: {
//     id: 'learner-dash.userProfile.educationLevelMaster',
//     description: 'Master education level',
//     defaultMessage: 'Master\'s Degree',
//   },
//   educationLevelOther: {
//     id: 'learner-dash.userProfile.educationLevelOther',
//     description: 'Other education level',
//     defaultMessage: 'Other',
//   },
//   academicYearLabel: {
//     id: 'learner-dash.userProfile.academicYearLabel',
//     description: 'Label for academic year',
//     defaultMessage: 'Academic Year',
//   },
//   yearOne: {
//     id: 'learner-dash.userProfile.yearOne',
//     description: 'Year 1',
//     defaultMessage: 'Year 1',
//   },
//   yearTwo: {
//     id: 'learner-dash.userProfile.yearTwo',
//     description: 'Year 2',
//     defaultMessage: 'Year 2',
//   },
//   yearThree: {
//     id: 'learner-dash.userProfile.yearThree',
//     description: 'Year 3',
//     defaultMessage: 'Year 3',
//   },
//   yearFourPlus: {
//     id: 'learner-dash.userProfile.yearFourPlus',
//     description: 'Year 4+',
//     defaultMessage: 'Year 4+',
//   },
//   genderLabel: {
//     id: 'learner-dash.userProfile.genderLabel',
//     description: 'Label for gender',
//     defaultMessage: 'Gender',
//   },
//   genderMale: {
//     id: 'learner-dash.userProfile.genderMale',
//     description: 'Male gender option',
//     defaultMessage: 'Male',
//   },
//   genderFemale: {
//     id: 'learner-dash.userProfile.genderFemale',
//     description: 'Female gender option',
//     defaultMessage: 'Female',
//   },
//   genderOther: {
//     id: 'learner-dash.userProfile.genderOther',
//     description: 'Other gender option',
//     defaultMessage: 'Other',
//   },
//   gpaLabel: {
//     id: 'learner-dash.userProfile.gpaLabel',
//     description: 'Label for GPA/self-assessment',
//     defaultMessage: 'Current GPA / Self-Assessment (optional)',
//   },
//   gpaWeak: {
//     id: 'learner-dash.userProfile.gpaWeak',
//     description: 'Weak GPA level',
//     defaultMessage: 'Weak',
//   },
//   gpaAverage: {
//     id: 'learner-dash.userProfile.gpaAverage',
//     description: 'Average GPA level',
//     defaultMessage: 'Average',
//   },
//   gpaGood: {
//     id: 'learner-dash.userProfile.gpaGood',
//     description: 'Good GPA level',
//     defaultMessage: 'Good',
//   },
//   gpaExcellent: {
//     id: 'learner-dash.userProfile.gpaExcellent',
//     description: 'Excellent GPA level',
//     defaultMessage: 'Excellent',
//   },

//   // Interests
//   interestsHeader: {
//     id: 'learner-dash.userProfile.interestsHeader',
//     description: 'Header for interests selection',
//     defaultMessage: 'What are you interested in?',
//   },
//   interestsLabel: {
//     id: 'learner-dash.userProfile.interestsLabel',
//     description: 'Label for interests',
//     defaultMessage: 'Fields of Interest (select at least 1)',
//   },
//   previousCoursesLabel: {
//     id: 'learner-dash.userProfile.previousCoursesLabel',
//     description: 'Label for previous courses',
//     defaultMessage: 'Previous Courses/Subjects (optional)',
//   },
//   previousCoursesPlaceholder: {
//     id: 'learner-dash.userProfile.previousCoursesPlaceholder',
//     description: 'Placeholder for previous courses',
//     defaultMessage: 'Enter course names, separated by commas',
//   },

//   // Goals
//   goalsHeader: {
//     id: 'learner-dash.userProfile.goalsHeader',
//     description: 'Header for goals selection',
//     defaultMessage: 'What are your goals?',
//   },
//   studentGoalsLabel: {
//     id: 'learner-dash.userProfile.studentGoalsLabel',
//     description: 'Label for student goals',
//     defaultMessage: 'Short-term Goals for Next Term (select at least 1)',
//   },
//   professionalGoalsLabel: {
//     id: 'learner-dash.userProfile.professionalGoalsLabel',
//     description: 'Label for professional goals',
//     defaultMessage: 'Main Goals (select at least 1)',
//   },

//   // Demographics
//   demographicsHeader: {
//     id: 'learner-dash.userProfile.demographicsHeader',
//     description: 'Header for demographics',
//     defaultMessage: 'Just a few more details',
//   },
//   ageGroupLabel: {
//     id: 'learner-dash.userProfile.ageGroupLabel',
//     description: 'Label for age group',
//     defaultMessage: 'Age Group',
//   },

//   // Professional fields
//   professionalBasicInfo: {
//     id: 'learner-dash.userProfile.professionalBasicInfo',
//     description: 'Header for professional basic information',
//     defaultMessage: 'Tell us about yourself',
//   },
//   currentJobLabel: {
//     id: 'learner-dash.userProfile.currentJobLabel',
//     description: 'Label for current job',
//     defaultMessage: 'Current Job/Profession',
//   },
//   currentJobPlaceholder: {
//     id: 'learner-dash.userProfile.currentJobPlaceholder',
//     description: 'Placeholder for current job',
//     defaultMessage: 'Enter your current job title',
//   },
//   professionalFieldLabel: {
//     id: 'learner-dash.userProfile.professionalFieldLabel',
//     description: 'Label for professional field',
//     defaultMessage: 'Field/Industry',
//   },

//   // Teacher fields
//   teacherBasicInfo: {
//     id: 'learner-dash.userProfile.teacherBasicInfo',
//     description: 'Header for teacher basic information',
//     defaultMessage: 'Tell us about your teaching',
//   },
//   teachingSubjectLabel: {
//     id: 'learner-dash.userProfile.teachingSubjectLabel',
//     description: 'Label for teaching subject',
//     defaultMessage: 'Subject/Major You Teach',
//   },
//   teachingSubjectPlaceholder: {
//     id: 'learner-dash.userProfile.teachingSubjectPlaceholder',
//     description: 'Placeholder for teaching subject',
//     defaultMessage: 'Enter subject or major',
//   },
//   teachingSchoolLabel: {
//     id: 'learner-dash.userProfile.teachingSchoolLabel',
//     description: 'Label for teaching school',
//     defaultMessage: 'School/Institution',
//   },

//   // Thank You Step
//   thankYouTitle: {
//     id: 'userProfileModal.thankYouTitle',
//     defaultMessage: 'Thank You!',
//     description: 'Thank you step title',
//   },
//   thankYouDescription: {
//     id: 'userProfileModal.thankYouDescription',
//     defaultMessage: 'Your profile has been saved successfully. We\'re excited to help you achieve your learning goals!',
//     description: 'Thank you step description',
//   },
//   thankYouSummaryTitle: {
//     id: 'userProfileModal.thankYouSummaryTitle',
//     defaultMessage: 'What happens next?',
//     description: 'Summary section title',
//   },
//   thankYouBenefit1: {
//     id: 'userProfileModal.thankYouBenefit1',
//     defaultMessage: 'Your dashboard has been personalized',
//     description: 'First next step',
//   },
//   thankYouBenefit2: {
//     id: 'userProfileModal.thankYouBenefit2',
//     defaultMessage: 'You\'ll receive customized course recommendations',
//     description: 'Second next step',
//   },
//   thankYouBenefit3: {
//     id: 'userProfileModal.thankYouBenefit3',
//     defaultMessage: 'Your learning path is ready to explore',
//     description: 'Third next step',
//   },
//   thankYouClosingMessage: {
//     id: 'userProfileModal.thankYouClosingMessage',
//     defaultMessage: 'Click "Get Started" to begin your learning journey!',
//     description: 'Closing message',
//   },

//   // Skip confirmation
//   skipConfirmTitle: {
//     id: 'userProfileModal.skipConfirmTitle',
//     defaultMessage: 'Skip Profile Setup?',
//     description: 'Skip confirmation dialog title',
//   },
//   skipConfirmMessage: {
//     id: 'userProfileModal.skipConfirmMessage',
//     defaultMessage: 'You can always complete your profile later from your account settings. Are you sure you want to skip?',
//     description: 'Skip confirmation message',
//   },
//   skipConfirmButton: {
//     id: 'userProfileModal.skipConfirmButton',
//     defaultMessage: 'Yes, Skip for Now',
//     description: 'Confirm skip button',
//   },
//   skipCancelButton: {
//     id: 'userProfileModal.skipCancelButton',
//     defaultMessage: 'Continue Setup',
//     description: 'Cancel skip button',
//   },

//   // Buttons
//   getStartedButton: {
//     id: 'userProfileModal.getStartedButton',
//     defaultMessage: 'Get Started',
//     description: 'Button to start from welcome screen',
//   },
//   finishButton: {
//     id: 'userProfileModal.finishButton',
//     defaultMessage: 'Get Started',
//     description: 'Button to finish from thank you screen',
//   },
//   nextButton: {
//     id: 'learner-dash.userProfile.nextButton',
//     description: 'Next button text',
//     defaultMessage: 'Next',
//   },
//   backButton: {
//     id: 'learner-dash.userProfile.backButton',
//     description: 'Back button text',
//     defaultMessage: 'Back',
//   },
//   submitButton: {
//     id: 'learner-dash.userProfile.submitButton',
//     description: 'Submit button text',
//     defaultMessage: 'Complete',
//   },
//   skipButton: {
//     id: 'learner-dash.userProfile.skipButton',
//     description: 'Skip button text',
//     defaultMessage: 'Skip for now',
//   },
//   submittingButton: {
//     id: 'userProfileModal.submittingButton',
//     defaultMessage: 'Submitting...',
//     description: 'Submit button text while saving',
//   },

//   // Progress
//   stepProgress: {
//     id: 'learner-dash.userProfile.stepProgress',
//     description: 'Step progress indicator',
//     defaultMessage: 'Step {current} of {total}',
//   },

//   // Validation messages
//   validationRequired: {
//     id: 'learner-dash.userProfile.validationRequired',
//     description: 'Required field validation',
//     defaultMessage: 'This field is required',
//   },
//   validationMinInterests: {
//     id: 'learner-dash.userProfile.validationMinInterests',
//     description: 'Minimum interests validation',
//     defaultMessage: 'Please select at least one field of interest',
//   },
//   validationMinGoals: {
//     id: 'learner-dash.userProfile.validationMinGoals',
//     description: 'Minimum goals validation',
//     defaultMessage: 'Please select at least one goal',
//   },
// });

// export default messages;


import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  // Modal title
  modalTitle: {
    id: 'learner-dash.userProfile.modalTitle',
    description: 'Title for user profile collection modal',
    defaultMessage: 'Chào mừng! Hãy cá nhân hóa trải nghiệm học tập của bạn',
  },

  // Welcome Step
  welcomeTitle: {
    id: 'userProfileModal.welcomeTitle',
    defaultMessage: 'Chào mừng đến với hành trình học tập của bạn!',
    description: 'Welcome step title',
  },
  welcomeDescription: {
    id: 'userProfileModal.welcomeDescription',
    defaultMessage: 'Hãy giúp chúng tôi cá nhân hóa trải nghiệm học tập của bạn bằng cách trả lời vài câu hỏi nhanh về bản thân.',
    description: 'Welcome step description',
  },
  welcomeBenefit1Title: {
    id: 'userProfileModal.welcomeBenefit1Title',
    defaultMessage: 'Gợi ý cá nhân hóa',
    description: 'First benefit title',
  },
  welcomeBenefit1Description: {
    id: 'userProfileModal.welcomeBenefit1Description',
    defaultMessage: 'Nhận gợi ý khóa học phù hợp với sở thích và mục tiêu của bạn.',
    description: 'First benefit description',
  },
  welcomeBenefit2Title: {
    id: 'userProfileModal.welcomeBenefit2Title',
    defaultMessage: 'Trải nghiệm học tập tốt hơn',
    description: 'Second benefit title',
  },
  welcomeBenefit2Description: {
    id: 'userProfileModal.welcomeBenefit2Description',
    defaultMessage: 'Chúng tôi sẽ tùy chỉnh bảng điều khiển để phù hợp với phong cách học tập của bạn.',
    description: 'Second benefit description',
  },
  welcomeBenefit3Title: {
    id: 'userProfileModal.welcomeBenefit3Title',
    defaultMessage: 'Theo dõi tiến độ của bạn',
    description: 'Third benefit title',
  },
  welcomeBenefit3Description: {
    id: 'userProfileModal.welcomeBenefit3Description',
    defaultMessage: 'Theo dõi thành tích và đạt được mục tiêu học tập của bạn.',
    description: 'Third benefit description',
  },
  welcomeDisclaimer: {
    id: 'userProfileModal.welcomeDisclaimer',
    defaultMessage: 'Điều này chỉ mất vài phút. Bạn có thể cập nhật thông tin sau bất kỳ lúc nào.',
    description: 'Welcome disclaimer text',
  },

  // User type selection
  selectUserType: {
    id: 'learner-dash.userProfile.selectUserType',
    description: 'Header for user type selection',
    defaultMessage: 'Bạn là ai?',
  },
  userTypeStudent: {
    id: 'learner-dash.userProfile.userTypeStudent',
    description: 'Student user type option',
    defaultMessage: 'Sinh viên',
  },
  userTypeProfessional: {
    id: 'learner-dash.userProfile.userTypeProfessional',
    description: 'Professional user type option',
    defaultMessage: 'Giáo sư / Khác',
  },
  userTypeTeacher: {
    id: 'learner-dash.userProfile.userTypeTeacher',
    description: 'Teacher user type option',
    defaultMessage: 'Giáo viên',
  },

  // Student - Basic Info
  studentBasicInfo: {
    id: 'learner-dash.userProfile.studentBasicInfo',
    description: 'Header for student basic information',
    defaultMessage: 'Hãy cho chúng tôi biết về việc học của bạn',
  },
  schoolLabel: {
    id: 'learner-dash.userProfile.schoolLabel',
    description: 'Label for school input',
    defaultMessage: 'Trường / Đại học',
  },
  schoolPlaceholder: {
    id: 'learner-dash.userProfile.schoolPlaceholder',
    description: 'Placeholder for school input',
    defaultMessage: 'Nhập tên trường của bạn',
  },
  facultyLabel: {
    id: 'learner-dash.userProfile.facultyLabel',
    description: 'Label for faculty input',
    defaultMessage: 'Khoa',
  },
  facultyPlaceholder: {
    id: 'learner-dash.userProfile.facultyPlaceholder',
    description: 'Placeholder for faculty input',
    defaultMessage: 'Nhập tên khoa của bạn',
  },
  majorLabel: {
    id: 'learner-dash.userProfile.majorLabel',
    description: 'Label for major input',
    defaultMessage: 'Ngành học (không bắt buộc)',
  },
  majorPlaceholder: {
    id: 'learner-dash.userProfile.majorPlaceholder',
    description: 'Placeholder for major input',
    defaultMessage: 'Nhập ngành học của bạn',
  },
  educationLevelLabel: {
    id: 'learner-dash.userProfile.educationLevelLabel',
    description: 'Label for education level',
    defaultMessage: 'Trình độ học vấn',
  },
  educationLevelBachelor: {
    id: 'learner-dash.userProfile.educationLevelBachelor',
    description: 'Bachelor education level',
    defaultMessage: 'Cử nhân',
  },
  educationLevelMaster: {
    id: 'learner-dash.userProfile.educationLevelMaster',
    description: 'Master education level',
    defaultMessage: 'Thạc sĩ',
  },
  educationLevelOther: {
    id: 'learner-dash.userProfile.educationLevelOther',
    description: 'Other education level',
    defaultMessage: 'Khác',
  },
  academicYearLabel: {
    id: 'learner-dash.userProfile.academicYearLabel',
    description: 'Label for academic year',
    defaultMessage: 'Năm học',
  },
  yearOne: {
    id: 'learner-dash.userProfile.yearOne',
    description: 'Year 1',
    defaultMessage: 'Năm 1',
  },
  yearTwo: {
    id: 'learner-dash.userProfile.yearTwo',
    description: 'Year 2',
    defaultMessage: 'Năm 2',
  },
  yearThree: {
    id: 'learner-dash.userProfile.yearThree',
    description: 'Year 3',
    defaultMessage: 'Năm 3',
  },
  yearFourPlus: {
    id: 'learner-dash.userProfile.yearFourPlus',
    description: 'Year 4+',
    defaultMessage: 'Năm 4 trở lên',
  },
  genderLabel: {
    id: 'learner-dash.userProfile.genderLabel',
    description: 'Label for gender',
    defaultMessage: 'Giới tính',
  },
  genderMale: {
    id: 'learner-dash.userProfile.genderMale',
    description: 'Male gender option',
    defaultMessage: 'Nam',
  },
  genderFemale: {
    id: 'learner-dash.userProfile.genderFemale',
    description: 'Female gender option',
    defaultMessage: 'Nữ',
  },
  genderOther: {
    id: 'learner-dash.userProfile.genderOther',
    description: 'Other gender option',
    defaultMessage: 'Khác',
  },
  gpaLabel: {
    id: 'learner-dash.userProfile.gpaLabel',
    description: 'Label for GPA/self-assessment',
    defaultMessage: 'Điểm trung bình hiện tại / Tự đánh giá (không bắt buộc)',
  },
  gpaWeak: {
    id: 'learner-dash.userProfile.gpaWeak',
    description: 'Weak GPA level',
    defaultMessage: 'Yếu',
  },
  gpaAverage: {
    id: 'learner-dash.userProfile.gpaAverage',
    description: 'Average GPA level',
    defaultMessage: 'Trung bình',
  },
  gpaGood: {
    id: 'learner-dash.userProfile.gpaGood',
    description: 'Good GPA level',
    defaultMessage: 'Khá',
  },
  gpaExcellent: {
    id: 'learner-dash.userProfile.gpaExcellent',
    description: 'Excellent GPA level',
    defaultMessage: 'Xuất sắc',
  },

  // Interests
  interestsHeader: {
    id: 'learner-dash.userProfile.interestsHeader',
    description: 'Header for interests selection',
    defaultMessage: 'Bạn quan tâm đến lĩnh vực nào?',
  },
  interestsLabel: {
    id: 'learner-dash.userProfile.interestsLabel',
    description: 'Label for interests',
    defaultMessage: 'Lĩnh vực quan tâm (chọn ít nhất 1)',
  },
  previousCoursesLabel: {
    id: 'learner-dash.userProfile.previousCoursesLabel',
    description: 'Label for previous courses',
    defaultMessage: 'Khóa học / Môn học trước đây (không bắt buộc)',
  },
  previousCoursesPlaceholder: {
    id: 'learner-dash.userProfile.previousCoursesPlaceholder',
    description: 'Placeholder for previous courses',
    defaultMessage: 'Nhập tên khóa học, cách nhau bằng dấu phẩy',
  },

  // Goals
  goalsHeader: {
    id: 'learner-dash.userProfile.goalsHeader',
    description: 'Header for goals selection',
    defaultMessage: 'Mục tiêu của bạn là gì?',
  },
  studentGoalsLabel: {
    id: 'learner-dash.userProfile.studentGoalsLabel',
    description: 'Label for student goals',
    defaultMessage: 'Mục tiêu ngắn hạn cho học kỳ tới (chọn ít nhất 1)',
  },
  professionalGoalsLabel: {
    id: 'learner-dash.userProfile.professionalGoalsLabel',
    description: 'Label for professional goals',
    defaultMessage: 'Mục tiêu chính (chọn ít nhất 1)',
  },

  // Demographics
  demographicsHeader: {
    id: 'learner-dash.userProfile.demographicsHeader',
    description: 'Header for demographics',
    defaultMessage: 'Chỉ còn vài thông tin nữa',
  },
  ageGroupLabel: {
    id: 'learner-dash.userProfile.ageGroupLabel',
    description: 'Label for age group',
    defaultMessage: 'Nhóm tuổi',
  },

  // Professional fields
  professionalBasicInfo: {
    id: 'learner-dash.userProfile.professionalBasicInfo',
    description: 'Header for professional basic information',
    defaultMessage: 'Hãy cho chúng tôi biết về bản thân bạn',
  },
  currentJobLabel: {
    id: 'learner-dash.userProfile.currentJobLabel',
    description: 'Label for current job',
    defaultMessage: 'Công việc / Nghề nghiệp hiện tại',
  },
  currentJobPlaceholder: {
    id: 'learner-dash.userProfile.currentJobPlaceholder',
    description: 'Placeholder for current job',
    defaultMessage: 'Nhập chức danh công việc hiện tại của bạn',
  },
  professionalFieldLabel: {
    id: 'learner-dash.userProfile.professionalFieldLabel',
    description: 'Label for professional field',
    defaultMessage: 'Ngành / Lĩnh vực',
  },

  // Teacher fields
  teacherBasicInfo: {
    id: 'learner-dash.userProfile.teacherBasicInfo',
    description: 'Header for teacher basic information',
    defaultMessage: 'Hãy cho chúng tôi biết về việc giảng dạy của bạn',
  },
  teachingSubjectLabel: {
    id: 'learner-dash.userProfile.teachingSubjectLabel',
    description: 'Label for teaching subject',
    defaultMessage: 'Môn học / Ngành bạn giảng dạy',
  },
  teachingSubjectPlaceholder: {
    id: 'learner-dash.userProfile.teachingSubjectPlaceholder',
    description: 'Placeholder for teaching subject',
    defaultMessage: 'Nhập môn học hoặc ngành',
  },
  teachingSchoolLabel: {
    id: 'learner-dash.userProfile.teachingSchoolLabel',
    description: 'Label for teaching school',
    defaultMessage: 'Trường / Cơ sở giảng dạy',
  },

  // Thank You Step
  thankYouTitle: {
    id: 'userProfileModal.thankYouTitle',
    defaultMessage: 'Cảm ơn bạn!',
    description: 'Thank you step title',
  },
  thankYouDescription: {
    id: 'userProfileModal.thankYouDescription',
    defaultMessage: 'Hồ sơ của bạn đã được lưu thành công. Chúng tôi rất vui được giúp bạn đạt được mục tiêu học tập!',
    description: 'Thank you step description',
  },
  thankYouSummaryTitle: {
    id: 'userProfileModal.thankYouSummaryTitle',
    defaultMessage: 'Bước tiếp theo là gì?',
    description: 'Summary section title',
  },
  thankYouBenefit1: {
    id: 'userProfileModal.thankYouBenefit1',
    defaultMessage: 'Bảng điều khiển của bạn đã được cá nhân hóa',
    description: 'First next step',
  },
  thankYouBenefit2: {
    id: 'userProfileModal.thankYouBenefit2',
    defaultMessage: 'Bạn sẽ nhận được các gợi ý khóa học phù hợp',
    description: 'Second next step',
  },
  thankYouBenefit3: {
    id: 'userProfileModal.thankYouBenefit3',
    defaultMessage: 'Lộ trình học tập của bạn đã sẵn sàng',
    description: 'Third next step',
  },
  thankYouClosingMessage: {
    id: 'userProfileModal.thankYouClosingMessage',
    defaultMessage: 'Nhấn "Bắt đầu" để bắt đầu hành trình học tập của bạn!',
    description: 'Closing message',
  },

  // Skip confirmation
  skipConfirmTitle: {
    id: 'userProfileModal.skipConfirmTitle',
    defaultMessage: 'Bỏ qua thiết lập hồ sơ?',
    description: 'Skip confirmation dialog title',
  },
  skipConfirmMessage: {
    id: 'userProfileModal.skipConfirmMessage',
    defaultMessage: 'Bạn có thể hoàn thiện hồ sơ sau trong phần cài đặt tài khoản. Bạn có chắc muốn bỏ qua không?',
    description: 'Skip confirmation message',
  },
  skipConfirmButton: {
    id: 'userProfileModal.skipConfirmButton',
    defaultMessage: 'Vâng, bỏ qua tạm thời',
    description: 'Confirm skip button',
  },
  skipCancelButton: {
    id: 'userProfileModal.skipCancelButton',
    defaultMessage: 'Tiếp tục thiết lập',
    description: 'Cancel skip button',
  },

  // Buttons
  getStartedButton: {
    id: 'userProfileModal.getStartedButton',
    defaultMessage: 'Bắt đầu',
    description: 'Button to start from welcome screen',
  },
  finishButton: {
    id: 'userProfileModal.finishButton',
    defaultMessage: 'Bắt đầu',
    description: 'Button to finish from thank you screen',
  },
  nextButton: {
    id: 'learner-dash.userProfile.nextButton',
    description: 'Next button text',
    defaultMessage: 'Tiếp theo',
  },
  backButton: {
    id: 'learner-dash.userProfile.backButton',
    description: 'Back button text',
    defaultMessage: 'Quay lại',
  },
  submitButton: {
    id: 'learner-dash.userProfile.submitButton',
    description: 'Submit button text',
    defaultMessage: 'Hoàn thành',
  },
  skipButton: {
    id: 'learner-dash.userProfile.skipButton',
    description: 'Skip button text',
    defaultMessage: 'Bỏ qua tạm thời',
  },
  submittingButton: {
    id: 'userProfileModal.submittingButton',
    defaultMessage: 'Đang gửi...',
    description: 'Submit button text while saving',
  },

  // Progress
  stepProgress: {
    id: 'learner-dash.userProfile.stepProgress',
    description: 'Step progress indicator',
    defaultMessage: 'Bước {current} trên {total}',
  },

  // Validation messages
  validationRequired: {
    id: 'learner-dash.userProfile.validationRequired',
    description: 'Required field validation',
    defaultMessage: 'Trường này là bắt buộc',
  },
  validationMinInterests: {
    id: 'learner-dash.userProfile.validationMinInterests',
    description: 'Minimum interests validation',
    defaultMessage: 'Vui lòng chọn ít nhất một lĩnh vực quan tâm',
  },
  validationMinGoals: {
    id: 'learner-dash.userProfile.validationMinGoals',
    description: 'Minimum goals validation',
    defaultMessage: 'Vui lòng chọn ít nhất một mục tiêu',
  },
});

export default messages;
