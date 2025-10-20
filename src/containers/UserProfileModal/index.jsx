import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ModalDialog,
  Button,
  ActionRow,
  ProgressBar,
} from '@openedx/paragon';

import useUserProfileModal from './hooks';
import { USER_TYPES } from './constants';
import {
  UserTypeStep,
  StudentBasicInfoStep,
  ProfessionalBasicInfoStep,
  TeacherBasicInfoStep,
  InterestsStep,
  GoalsStep,
  DemographicsStep,
} from './components';
import messages from './messages';
import './index.scss';

const UserProfileModal = ({ isOpen, onClose, onSubmit }) => {
  const { formatMessage } = useIntl();
  const {
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
  } = useUserProfileModal({ onClose, onSubmit });

  const stepProgress = getStepProgress();

  const renderStepContent = () => {
    // Step 0: User Type Selection
    if (currentStep === 0) {
      return (
        <UserTypeStep
          userType={userType}
          setUserType={setUserType}
          error={errors.userType}
        />
      );
    }

    // For Students
    if (userType === USER_TYPES.STUDENT) {
      switch (currentStep) {
        case 1:
          return (
            <StudentBasicInfoStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          );
        case 2:
          return (
            <InterestsStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          );
        case 3:
          return (
            <GoalsStep
              userType={userType}
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          );
        case 4:
          return (
            <DemographicsStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          );
        default:
          return null;
      }
    }

    // For Professionals
    if (userType === USER_TYPES.PROFESSIONAL) {
      switch (currentStep) {
        case 1:
          return (
            <ProfessionalBasicInfoStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          );
        case 2:
          return (
            <GoalsStep
              userType={userType}
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          );
        case 3:
          return (
            <DemographicsStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          );
        default:
          return null;
      }
    }

    // For Teachers
    if (userType === USER_TYPES.TEACHER) {
      switch (currentStep) {
        case 1:
          return (
            <TeacherBasicInfoStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          );
        case 2:
          return (
            <DemographicsStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          );
        default:
          return null;
      }
    }

    return null;
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={handleSkip}
      hasCloseButton
      size="lg"
      className="user-profile-modal"
      title={formatMessage(messages.modalTitle)}
    >
      <ModalDialog.Header>
        <ModalDialog.Title>
          {formatMessage(messages.modalTitle)}
        </ModalDialog.Title>
      </ModalDialog.Header>

      <ModalDialog.Body>
        {/* Progress indicator */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted">
              {formatMessage(messages.stepProgress, {
                current: stepProgress.current,
                total: stepProgress.total,
              })}
            </small>
          </div>
          <ProgressBar
            now={(stepProgress.current / stepProgress.total) * 100}
            variant="primary"
          />
        </div>

        {/* Step content */}
        <div className="step-content">{renderStepContent()}</div>
      </ModalDialog.Body>

      <ModalDialog.Footer>
        <ActionRow>
          <ActionRow.Spacer />

          {/* Skip button - only show on first step */}
          {currentStep === 0 && (
            <Button variant="link" onClick={handleSkip}>
              {formatMessage(messages.skipButton)}
            </Button>
          )}

          {/* Back button - hide on first step */}
          {currentStep > 0 && (
            <Button variant="outline-primary" onClick={handleBack}>
              {formatMessage(messages.backButton)}
            </Button>
          )}

          {/* Next/Submit button */}
          {isLastStep() ? (
            <Button variant="primary" onClick={handleSubmit}>
              {formatMessage(messages.submitButton)}
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext}>
              {formatMessage(messages.nextButton)}
            </Button>
          )}
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

UserProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
};

UserProfileModal.defaultProps = {
  onSubmit: null,
};

export default UserProfileModal;
