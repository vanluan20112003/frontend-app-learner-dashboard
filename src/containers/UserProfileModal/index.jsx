// import React from 'react';
// import PropTypes from 'prop-types';
// import { useIntl } from '@edx/frontend-platform/i18n';
// import {
//   ModalDialog,
//   Button,
//   ActionRow,
//   ProgressBar,
//   Alert,
// } from '@openedx/paragon';

// import useUserProfileModal from './hooks';
// import { USER_TYPES } from './constants';
// import {
//   UserTypeStep,
//   StudentBasicInfoStep,
//   ProfessionalBasicInfoStep,
//   TeacherBasicInfoStep,
//   InterestsStep,
//   GoalsStep,
//   DemographicsStep,
// } from './components';
// import messages from './messages';
// import './index.scss';

// const UserProfileModal = ({ isOpen, onClose, onSubmit }) => {
//   const { formatMessage } = useIntl();
//   const {
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
//     isSubmitting,
//     submitError,
//   } = useUserProfileModal({ onClose, onSubmit });

//   const stepProgress = getStepProgress();

//   // Use hook's submitError if available, otherwise use prop error
//   const displayError = submitError;
//   // Use hook's isSubmitting if available, otherwise use prop isLoading
//   const isLoading = isSubmitting;

//   const renderStepContent = () => {
//     // Step 0: User Type Selection
//     if (currentStep === 0) {
//       return (
//         <UserTypeStep
//           userType={userType}
//           setUserType={setUserType}
//           error={errors.userType}
//         />
//       );
//     }

//     // For Students
//     if (userType === USER_TYPES.STUDENT) {
//       switch (currentStep) {
//         case 1:
//           return (
//             <StudentBasicInfoStep
//               formData={formData}
//               updateFormData={updateFormData}
//               errors={errors}
//             />
//           );
//         case 2:
//           return (
//             <InterestsStep
//               formData={formData}
//               updateFormData={updateFormData}
//               errors={errors}
//             />
//           );
//         case 3:
//           return (
//             <GoalsStep
//               userType={userType}
//               formData={formData}
//               updateFormData={updateFormData}
//               errors={errors}
//             />
//           );
//         case 4:
//           return (
//             <DemographicsStep
//               formData={formData}
//               updateFormData={updateFormData}
//               errors={errors}
//             />
//           );
//         default:
//           return null;
//       }
//     }

//     // For Professionals
//     if (userType === USER_TYPES.PROFESSIONAL) {
//       switch (currentStep) {
//         case 1:
//           return (
//             <ProfessionalBasicInfoStep
//               formData={formData}
//               updateFormData={updateFormData}
//               errors={errors}
//             />
//           );
//         case 2:
//           return (
//             <GoalsStep
//               userType={userType}
//               formData={formData}
//               updateFormData={updateFormData}
//               errors={errors}
//             />
//           );
//         case 3:
//           return (
//             <DemographicsStep
//               formData={formData}
//               updateFormData={updateFormData}
//               errors={errors}
//             />
//           );
//         default:
//           return null;
//       }
//     }

//     // For Teachers
//     if (userType === USER_TYPES.TEACHER) {
//       switch (currentStep) {
//         case 1:
//           return (
//             <TeacherBasicInfoStep
//               formData={formData}
//               updateFormData={updateFormData}
//               errors={errors}
//             />
//           );
//         case 2:
//           return (
//             <DemographicsStep
//               formData={formData}
//               updateFormData={updateFormData}
//               errors={errors}
//             />
//           );
//         default:
//           return null;
//       }
//     }

//     return null;
//   };

//   return (
//     <ModalDialog
//       isOpen={isOpen}
//       onClose={handleSkip}
//       hasCloseButton
//       size="lg"
//       className="user-profile-modal"
//       title={formatMessage(messages.modalTitle)}
//     >
//       <ModalDialog.Header>
//         <ModalDialog.Title>
//           {formatMessage(messages.modalTitle)}
//         </ModalDialog.Title>
//       </ModalDialog.Header>

//       <ModalDialog.Body>
//         {/* Error alert */}
//         {displayError && (
//           <Alert variant="danger" className="mb-3">
//             {displayError}
//           </Alert>
//         )}

//         {/* Progress indicator */}
//         <div className="mb-4">
//           <div className="d-flex justify-content-between align-items-center mb-2">
//             <small className="text-muted">
//               {formatMessage(messages.stepProgress, {
//                 current: stepProgress.current,
//                 total: stepProgress.total,
//               })}
//             </small>
//           </div>
//           <ProgressBar
//             now={(stepProgress.current / stepProgress.total) * 100}
//             variant="primary"
//           />
//         </div>

//         {/* Step content */}
//         <div className="step-content">{renderStepContent()}</div>
//       </ModalDialog.Body>

//       <ModalDialog.Footer>
//         <ActionRow>
//           <ActionRow.Spacer />

//           {/* Skip button - only show on first step */}
//           {currentStep === 0 && (
//             <Button variant="link" onClick={handleSkip} disabled={isLoading}>
//               {formatMessage(messages.skipButton)}
//             </Button>
//           )}

//           {/* Back button - hide on first step */}
//           {currentStep > 0 && (
//             <Button variant="outline-primary" onClick={handleBack} disabled={isLoading}>
//               {formatMessage(messages.backButton)}
//             </Button>
//           )}

//           {/* Next/Submit button */}
//           {isLastStep() ? (
//             <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
//               {isLoading ? formatMessage(messages.submittingButton) : formatMessage(messages.submitButton)}
//             </Button>
//           ) : (
//             <Button variant="primary" onClick={handleNext} disabled={isLoading}>
//               {formatMessage(messages.nextButton)}
//             </Button>
//           )}
//         </ActionRow>
//       </ModalDialog.Footer>
//     </ModalDialog>
//   );
// };

// UserProfileModal.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSubmit: PropTypes.func,
// };

// UserProfileModal.defaultProps = {
//   onSubmit: null,
// };

// export default UserProfileModal;

import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ModalDialog,
  Button,
  ActionRow,
  ProgressBar,
  Alert,
  AlertModal,
} from '@openedx/paragon';

import useUserProfileModal from './hooks';
import { USER_TYPES } from './constants';
import {
  WelcomeStep,
  UserTypeStep,
  StudentBasicInfoStep,
  ProfessionalBasicInfoStep,
  TeacherBasicInfoStep,
  InterestsStep,
  GoalsStep,
  DemographicsStep,
  ThankYouStep,
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
    isSubmitting,
    submitError,
    showSkipConfirm,
    showWelcome,
    showThankYou,
  } = useUserProfileModal({ onClose, onSubmit });

  const stepProgress = getStepProgress();

  React.useEffect(() => {
    console.log('Modal state:', {
      showWelcome,
      showThankYou,
      currentStep,
      userType,
      isLastStep: isLastStep(),
    });
  }, [showWelcome, showThankYou, currentStep, userType]);

  const renderStepContent = () => {
    // Show Welcome Screen
    if (showWelcome) {
      return <WelcomeStep />;
    }

    // Show Thank You Screen
    if (showThankYou) {
      console.log("tried show thankyou")
      return <ThankYouStep userType={userType} />;
    }

    // Step 0: User Type Selection (shown as Step 1 in progress)
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
    <>
      <ModalDialog
        isOpen={isOpen}
        onClose={showWelcome ? handleSkipClick : undefined}
        hasCloseButton={showWelcome}
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
          {/* Error alert */}
          {submitError && !showWelcome && !showThankYou && (
            <Alert variant="danger" className="mb-3">
              {submitError}
            </Alert>
          )}

          {/* Progress indicator - hide on welcome and thank you */}
          {!showWelcome && !showThankYou && (
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
          )}

          {/* Step content */}
          <div className="step-content">{renderStepContent()}</div>
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <ActionRow>
            <ActionRow.Spacer />

            {/* Welcome Screen Buttons */}
            {showWelcome && (
              <>
                <Button variant="link" onClick={handleSkipClick}>
                  {formatMessage(messages.skipButton)}
                </Button>
                <Button variant="primary" onClick={handleWelcomeNext}>
                  {formatMessage(messages.getStartedButton)}
                </Button>
              </>
            )}

            {/* Thank You Screen Button */}
            {showThankYou && (
              <Button variant="primary" onClick={handleFinish}>
                {formatMessage(messages.finishButton)}
              </Button>
            )}

            {/* Form Steps Buttons */}
            {!showWelcome && !showThankYou && (
              <>
                {/* Back button - hide on first step */}
                {currentStep > 0 && (
                  <Button
                    variant="outline-primary"
                    onClick={handleBack}
                    disabled={isSubmitting}
                  >
                    {formatMessage(messages.backButton)}
                  </Button>
                )}

                {/* Next/Submit button */}
                {isLastStep() ? (
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting 
                      ? formatMessage(messages.submittingButton) 
                      : formatMessage(messages.submitButton)}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleNext}
                    disabled={isSubmitting}
                  >
                    {formatMessage(messages.nextButton)}
                  </Button>
                )}
              </>
            )}
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>

      {/* Skip Confirmation Modal */}
      <AlertModal
        isOpen={showSkipConfirm}
        title={formatMessage(messages.skipConfirmTitle)}
        onClose={handleSkipCancel}
        footerNode={(
          <ActionRow>
            <Button variant="tertiary" onClick={handleSkipCancel}>
              {formatMessage(messages.skipCancelButton)}
            </Button>
            <Button variant="primary" onClick={handleSkipConfirm}>
              {formatMessage(messages.skipConfirmButton)}
            </Button>
          </ActionRow>
        )}
      >
        <p>{formatMessage(messages.skipConfirmMessage)}</p>
      </AlertModal>
    </>
  );
};

UserProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default UserProfileModal;