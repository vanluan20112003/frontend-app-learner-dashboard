import React from 'react';
import { StrictDict } from 'utils';
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
});

const initialFormData = {
  // Common fields
  userType: null,
  gender: null,
  ageGroup: null,

  // Student fields
  school: '',
  faculty: '',
  major: '',
  educationLevel: null,
  academicYear: null,
  gpa: null,
  fieldsOfInterest: [],
  previousCourses: '',
  studentGoals: [],

  // Professional fields
  currentJob: '',
  professionalField: '',
  professionalGoals: [],

  // Teacher fields
  teachingSubject: '',
  teachingSchool: '',
};

export const useUserProfileModal = ({ onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = state.currentStep(0);
  const [userType, setUserType] = state.userType(null);
  const [formData, setFormData] = state.formData(initialFormData);
  const [errors, setErrors] = state.errors({});

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user updates field
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
      case 0: // User type selection
        if (!userType) {
          newErrors.userType = 'validationRequired';
        }
        break;

      case 1: // Basic info
        if (userType === USER_TYPES.STUDENT) {
          if (!formData.school.trim()) {
            newErrors.school = 'validationRequired';
          }
          if (!formData.faculty.trim()) {
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
          if (!formData.currentJob.trim()) {
            newErrors.currentJob = 'validationRequired';
          }
          if (!formData.gender) {
            newErrors.gender = 'validationRequired';
          }
          if (!formData.professionalField.trim()) {
            newErrors.professionalField = 'validationRequired';
          }
        } else if (userType === USER_TYPES.TEACHER) {
          if (!formData.teachingSubject.trim()) {
            newErrors.teachingSubject = 'validationRequired';
          }
          if (!formData.teachingSchool.trim()) {
            newErrors.teachingSchool = 'validationRequired';
          }
          if (!formData.gender) {
            newErrors.gender = 'validationRequired';
          }
        }
        break;

      case 2: // Interests (for students) or Goals (for others)
        if (userType === USER_TYPES.STUDENT) {
          if (formData.fieldsOfInterest.length < VALIDATION.MIN_INTERESTS) {
            newErrors.fieldsOfInterest = 'validationMinInterests';
          }
        }
        break;

      case 3: // Goals (for students) or Demographics (for others)
        if (userType === USER_TYPES.STUDENT) {
          if (formData.studentGoals.length < VALIDATION.MIN_GOALS) {
            newErrors.studentGoals = 'validationMinGoals';
          }
        } else if (userType === USER_TYPES.PROFESSIONAL) {
          if (formData.professionalGoals.length < VALIDATION.MIN_GOALS) {
            newErrors.professionalGoals = 'validationMinGoals';
          }
        }
        break;

      case 4: // Demographics (for students only)
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
        return 5; // Type, Basic Info, Interests, Goals, Demographics
      case USER_TYPES.PROFESSIONAL:
        return 4; // Type, Basic Info, Goals, Demographics
      case USER_TYPES.TEACHER:
        return 3; // Type, Basic Info, Demographics
      default:
        return 1;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      // If selecting user type, update it in form data
      if (currentStep === 0 && userType) {
        setFormData((prev) => ({ ...prev, userType }));
      }
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    setErrors({});
  };

  const handleSubmit = () => {
    if (validateStep()) {
      const submissionData = {
        ...formData,
        userType,
      };

      if (onSubmit) {
        onSubmit(submissionData);
      }

      if (onClose) {
        onClose();
      }
    }
  };

  const handleSkip = () => {
    if (onClose) {
      onClose();
    }
  };

  const isLastStep = () => currentStep === getTotalSteps() - 1;

  const getStepProgress = () => ({
    current: currentStep + 1,
    total: getTotalSteps(),
  });

  return {
    currentStep,
    userType,
    setUserType,
    formData,
    updateFormData,
    errors,
    handleNext,
    handleBack,
    handleSubmit,
    handleSkip,
    isLastStep,
    getStepProgress,
    getTotalSteps,
  };
};

export default useUserProfileModal;
