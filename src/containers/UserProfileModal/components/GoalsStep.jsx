import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';
import {
  USER_TYPES,
  STUDENT_GOALS,
  PROFESSIONAL_GOALS,
} from '../constants';
import messages from '../messages';

const GoalsStep = ({
  userType,
  formData,
  updateFormData,
  errors,
}) => {
  const { formatMessage } = useIntl();

  const isStudent = userType === USER_TYPES.STUDENT;
  const isProfessional = userType === USER_TYPES.PROFESSIONAL;

  const goals = isStudent ? STUDENT_GOALS : PROFESSIONAL_GOALS;
  const goalsField = isStudent ? 'studentGoals' : 'professionalGoals';
  const currentGoals = formData[goalsField] || [];

  const handleGoalToggle = (value) => {
    const newGoals = currentGoals.includes(value)
      ? currentGoals.filter((item) => item !== value)
      : [...currentGoals, value];

    updateFormData(goalsField, newGoals);
  };

  return (
    <div className="goals-step">
      <h3 className="mb-4">{formatMessage(messages.goalsHeader)}</h3>

      <Form.Group className="mb-3">
        <Form.Label>
          {formatMessage(
            isStudent
              ? messages.studentGoalsLabel
              : messages.professionalGoalsLabel,
          )}
        </Form.Label>
        <div className="goals-checkboxes">
          {goals.map((goal) => (
            <Form.Checkbox
              key={goal.value}
              checked={currentGoals.includes(goal.value)}
              onChange={() => handleGoalToggle(goal.value)}
            >
              {goal.label}
            </Form.Checkbox>
          ))}
        </div>
        {errors[goalsField] && (
          <Form.Control.Feedback type="invalid" className="d-block">
            {formatMessage(messages[errors[goalsField]] || messages.validationMinGoals)}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </div>
  );
};

GoalsStep.propTypes = {
  userType: PropTypes.string.isRequired,
  formData: PropTypes.shape({
    studentGoals: PropTypes.arrayOf(PropTypes.string),
    professionalGoals: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  updateFormData: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    studentGoals: PropTypes.string,
    professionalGoals: PropTypes.string,
  }),
};

GoalsStep.defaultProps = {
  errors: {},
};

export default GoalsStep;
