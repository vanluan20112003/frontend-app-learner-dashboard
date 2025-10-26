// import React from 'react';
// import { StrictDict } from 'utils';
// import { saveUserProfile } from '../../api/userProfilePreference';
// import {
//   USER_TYPES,
//   EDUCATION_LEVELS,
//   VALIDATION,
// } from './constants';

// export const state = StrictDict({
//   currentStep: (val) => React.useState(val),
//   userType: (val) => React.useState(val),
//   formData: (val) => React.useState(val),
//   errors: (val) => React.useState(val),
//   isSubmitting: (val) => React.useState(val),
//   submitError: (val) => React.useState(val),
// });

// const initialFormData = {
//   // Common fields
//   userType: null,
//   gender: null,
//   ageGroup: null,

//   // Student fields
//   school: '',
//   faculty: '',
//   major: '',
//   educationLevel: null,
//   academicYear: null,
//   gpa: null,
//   fieldsOfInterest: [],
//   previousCourses: '',
//   studentGoals: [],

//   // Professional fields
//   currentJob: '',
//   professionalField: '',
//   professionalGoals: [],

//   // Teacher fields
//   teachingSubject: '',
//   teachingSchool: '',
// };

// export const useUserProfileModal = ({ onClose, onSubmit }) => {
//   const [currentStep, setCurrentStep] = state.currentStep(0);
//   const [userType, setUserType] = state.userType(null);
//   const [formData, setFormData] = state.formData(initialFormData);
//   const [errors, setErrors] = state.errors({});

//   const [isSubmitting, setIsSubmitting] = state.isSubmitting(false);
//   const [submitError, setSubmitError] = state.submitError(null);

//   const updateFormData = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     // Clear error when user updates field
//     if (errors[field]) {
//       setErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[field];
//         return newErrors;
//       });
//     }
//   };

//   const validateStep = () => {
//     const newErrors = {};

//     switch (currentStep) {
//       case 0: // User type selection
//         if (!userType) {
//           newErrors.userType = 'validationRequired';
//         }
//         break;

//       case 1: // Basic info
//         if (userType === USER_TYPES.STUDENT) {
//           if (!formData.school.trim()) {
//             newErrors.school = 'validationRequired';
//           }
//           if (!formData.faculty.trim()) {
//             newErrors.faculty = 'validationRequired';
//           }
//           if (!formData.educationLevel) {
//             newErrors.educationLevel = 'validationRequired';
//           }
//           if (formData.educationLevel === EDUCATION_LEVELS.BACHELOR && !formData.academicYear) {
//             newErrors.academicYear = 'validationRequired';
//           }
//           if (!formData.gender) {
//             newErrors.gender = 'validationRequired';
//           }
//         } else if (userType === USER_TYPES.PROFESSIONAL) {
//           if (!formData.currentJob.trim()) {
//             newErrors.currentJob = 'validationRequired';
//           }
//           if (!formData.gender) {
//             newErrors.gender = 'validationRequired';
//           }
//           if (!formData.professionalField.trim()) {
//             newErrors.professionalField = 'validationRequired';
//           }
//         } else if (userType === USER_TYPES.TEACHER) {
//           if (!formData.teachingSubject.trim()) {
//             newErrors.teachingSubject = 'validationRequired';
//           }
//           if (!formData.teachingSchool.trim()) {
//             newErrors.teachingSchool = 'validationRequired';
//           }
//           if (!formData.gender) {
//             newErrors.gender = 'validationRequired';
//           }
//         }
//         break;

//       case 2: // Interests (for students) or Goals (for others)
//         if (userType === USER_TYPES.STUDENT) {
//           if (formData.fieldsOfInterest.length < VALIDATION.MIN_INTERESTS) {
//             newErrors.fieldsOfInterest = 'validationMinInterests';
//           }
//         }
//         break;

//       case 3: // Goals (for students) or Demographics (for others)
//         if (userType === USER_TYPES.STUDENT) {
//           if (formData.studentGoals.length < VALIDATION.MIN_GOALS) {
//             newErrors.studentGoals = 'validationMinGoals';
//           }
//         } else if (userType === USER_TYPES.PROFESSIONAL) {
//           if (formData.professionalGoals.length < VALIDATION.MIN_GOALS) {
//             newErrors.professionalGoals = 'validationMinGoals';
//           }
//         }
//         break;

//       case 4: // Demographics (for students only)
//         if (!formData.ageGroup) {
//           newErrors.ageGroup = 'validationRequired';
//         }
//         break;

//       default:
//         break;
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const getTotalSteps = () => {
//     if (!userType) return 1;

//     switch (userType) {
//       case USER_TYPES.STUDENT:
//         return 5; // Type, Basic Info, Interests, Goals, Demographics
//       case USER_TYPES.PROFESSIONAL:
//         return 4; // Type, Basic Info, Goals, Demographics
//       case USER_TYPES.TEACHER:
//         return 3; // Type, Basic Info, Demographics
//       default:
//         return 1;
//     }
//   };

//   const handleNext = () => {
//     if (validateStep()) {
//       // If selecting user type, update it in form data
//       if (currentStep === 0 && userType) {
//         setFormData((prev) => ({ ...prev, userType }));
//       }
//       setCurrentStep((prev) => prev + 1);
//     }
//   };

//   const handleBack = () => {
//     setCurrentStep((prev) => prev - 1);
//     setErrors({});
//   };

//   // const handleSubmit = () => {
//   //   if (validateStep()) {
//   //     const submissionData = {
//   //       ...formData,
//   //       userType,
//   //     };

//   //     if (onSubmit) {
//   //       onSubmit(submissionData);
//   //     }

//   //     if (onClose) {
//   //       onClose();
//   //     }
//   //   }
//   // };

//   const handleSubmit = async () => {
//     if (!validateStep()) {
//       return;
//     }

    

//     try {
//       setIsSubmitting(true);
//       setSubmitError(null);

//       const submissionData = {
//         ...formData,
//         userType,
//       };

//       console.log('Submitting profile data:', submissionData);

//       // Save to backend API
//       await saveUserProfile(submissionData);

//       console.log('Profile saved successfully');

//       // Call the onSubmit callback if provided
//       if (onSubmit) {
//         onSubmit(submissionData);
//       }

//       // Close modal
//       if (onClose) {
//         onClose();
//       }
//     } catch (err) {
//       console.error('Profile submit error:', err);
//       setSubmitError(err.message || 'Failed to save profile. Please try again.');
//       // Keep modal open so user can retry
//     } finally {
//       setIsSubmitting(false);
//     }
//   };


//   const handleSkip = () => {
//     if (onClose) {
//       onClose();
//     }
//   };

//   const isLastStep = () => currentStep === getTotalSteps() - 1;

//   const getStepProgress = () => ({
//     current: currentStep + 1,
//     total: getTotalSteps(),
//   });

//   return {
//     currentStep,
//     userType,
//     setUserType,
//     formData,
//     updateFormData,
//     errors,
//     handleNext,
//     handleBack,
//     handleSubmit,
//     handleSkip,
//     isLastStep,
//     getStepProgress,
//     getTotalSteps,
//     isSubmitting,
//     submitError,
//   };
// };

// export default useUserProfileModal;

import React from 'react';
import { StrictDict } from 'utils';
import { saveUserProfile } from '../../api/userProfilePreference';
import {
  USER_TYPES,
  EDUCATION_LEVELS,
  VALIDATION,
} from './constants';

export const state = StrictDict({
  currentStep: (val) => React.useState(val),
  userType: (val) => React.useState(val),
  formData: (val) => React.useState(val),
  errors: (val) => React.useState(val),
  isSubmitting: (val) => React.useState(val),
  submitError: (val) => React.useState(val),
  showSkipConfirm: (val) => React.useState(val),
  showWelcome: (val) => React.useState(val),
  showThankYou: (val) => React.useState(val),
});

const initialFormData = {
  userType: null,
  gender: null,
  ageGroup: null,
  school: '',
  faculty: '',
  major: '',
  educationLevel: null,
  academicYear: null,
  gpa: null,
  fieldsOfInterest: [],
  previousCourses: '',
  studentGoals: [],
  currentJob: '',
  professionalField: '',
  professionalGoals: [],
  teachingSubject: '',
  teachingSchool: '',
};

export const useUserProfileModal = ({ onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = state.currentStep(0);
  const [userType, setUserType] = state.userType(null);
  const [formData, setFormData] = state.formData(initialFormData);
  const [errors, setErrors] = state.errors({});
  const [isSubmitting, setIsSubmitting] = state.isSubmitting(false);
  const [submitError, setSubmitError] = state.submitError(null);
  const [showSkipConfirm, setShowSkipConfirm] = state.showSkipConfirm(false);
  const [showWelcome, setShowWelcome] = state.showWelcome(true); // Start with welcome
  const [showThankYou, setShowThankYou] = state.showThankYou(false);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 0:
        if (!userType) {
          newErrors.userType = 'validationRequired';
        }
        break;

      case 1:
        if (userType === USER_TYPES.STUDENT) {
          if (!formData.school?.trim()) {
            newErrors.school = 'validationRequired';
          }
          if (!formData.faculty?.trim()) {
            newErrors.faculty = 'validationRequired';
          }
          if (!formData.educationLevel) {
            newErrors.educationLevel = 'validationRequired';
          }
          if (formData.educationLevel === EDUCATION_LEVELS.BACHELOR && !formData.academicYear) {
            newErrors.academicYear = 'validationRequired';
          }
          if (!formData.gender) {
            newErrors.gender = 'validationRequired';
          }
        } else if (userType === USER_TYPES.PROFESSIONAL) {
          if (!formData.currentJob?.trim()) {
            newErrors.currentJob = 'validationRequired';
          }
          if (!formData.gender) {
            newErrors.gender = 'validationRequired';
          }
          if (!formData.professionalField?.trim()) {
            newErrors.professionalField = 'validationRequired';
          }
        } else if (userType === USER_TYPES.TEACHER) {
          if (!formData.teachingSubject?.trim()) {
            newErrors.teachingSubject = 'validationRequired';
          }
          if (!formData.teachingSchool?.trim()) {
            newErrors.teachingSchool = 'validationRequired';
          }
          if (!formData.gender) {
            newErrors.gender = 'validationRequired';
          }
        }
        break;

      case 2:
        if (userType === USER_TYPES.STUDENT) {
          if (!formData.fieldsOfInterest || formData.fieldsOfInterest.length < VALIDATION.MIN_INTERESTS) {
            newErrors.fieldsOfInterest = 'validationMinInterests';
          }
        }
        break;

      case 3:
        if (userType === USER_TYPES.STUDENT) {
          if (!formData.studentGoals || formData.studentGoals.length < VALIDATION.MIN_GOALS) {
            newErrors.studentGoals = 'validationMinGoals';
          }
        } else if (userType === USER_TYPES.PROFESSIONAL) {
          if (!formData.professionalGoals || formData.professionalGoals.length < VALIDATION.MIN_GOALS) {
            newErrors.professionalGoals = 'validationMinGoals';
          }
        }
        break;

      case 4:
        if (!formData.ageGroup) {
          newErrors.ageGroup = 'validationRequired';
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getTotalSteps = () => {
    if (!userType) return 1;

    switch (userType) {
      case USER_TYPES.STUDENT:
        return 5; // 0: UserType, 1: Basic, 2: Interests, 3: Goals, 4: Demographics
      case USER_TYPES.PROFESSIONAL:
        return 4; // 0: UserType, 1: Basic, 2: Goals, 3: Demographics
      case USER_TYPES.TEACHER:
        return 3; // 0: UserType, 1: Basic, 2: Demographics
      default:
        return 1;
    }
  };

  const handleWelcomeNext = () => {
    setShowWelcome(false);
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep === 0 && userType) {
        setFormData((prev) => ({ ...prev, userType }));
      }
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      setShowWelcome(true);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      return;
    }

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const submissionData = {
        ...formData,
        userType,
      };

      console.log('Submitting profile to backend:', submissionData);

      await saveUserProfile(submissionData);

      console.log('Profile saved successfully');

      setShowThankYou(true);

      console.log("tried show thankyou")
      if (onSubmit) {
        onSubmit(submissionData);
      }

      
      
    } catch (err) {
      console.error('Profile submission error:', err);

      let errorMessage = 'Failed to save profile. Please try again.';

      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.details) {
        const details = err.response.data.details;
        errorMessage = Object.entries(details)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('; ');
      }

      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipClick = () => {
    setShowSkipConfirm(true);
  };

  const handleSkipConfirm = () => {
    setShowSkipConfirm(false);
    if (onClose) {
      onClose();
    }
  };

  const handleSkipCancel = () => {
    setShowSkipConfirm(false);
  };

  const handleFinish = () => {
    if (onClose) {
      onClose();
    }
  };

  const isLastStep = () => currentStep === getTotalSteps() - 1;

  const getStepProgress = () => ({
    current: currentStep + 1,
    total: getTotalSteps(),
  });

  const handleUserTypeChange = (newType) => {
    setUserType(newType);
    setFormData(initialFormData); // just clear data
  };

  return {
    currentStep,
    userType,
    setUserType: handleUserTypeChange,
    formData,
    updateFormData,
    errors,
    handleWelcomeNext,
    handleNext,
    handleBack,
    handleSubmit,
    handleSkipClick,
    handleSkipConfirm,
    handleSkipCancel,
    handleFinish,
    isLastStep,
    getStepProgress,
    getTotalSteps,
    isSubmitting,
    submitError,
    showSkipConfirm,
    showWelcome,
    showThankYou,
  };
};

export default useUserProfileModal;