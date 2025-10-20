import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';
import { FIELDS_OF_INTEREST } from '../constants';
import messages from '../messages';

const InterestsStep = ({ formData, updateFormData, errors }) => {
  const { formatMessage } = useIntl();

  const handleInterestToggle = (value) => {
    const currentInterests = formData.fieldsOfInterest || [];
    const newInterests = currentInterests.includes(value)
      ? currentInterests.filter((item) => item !== value)
      : [...currentInterests, value];

    updateFormData('fieldsOfInterest', newInterests);
  };

  return (
    <div className="interests-step">
      <h3 className="mb-4">{formatMessage(messages.interestsHeader)}</h3>

      <Form.Group className="mb-3">
        <Form.Label>{formatMessage(messages.interestsLabel)}</Form.Label>
        <div className="interests-checkboxes">
          {FIELDS_OF_INTEREST.map((field) => (
            <Form.Checkbox
              key={field.value}
              checked={formData.fieldsOfInterest.includes(field.value)}
              onChange={() => handleInterestToggle(field.value)}
            >
              {field.label}
            </Form.Checkbox>
          ))}
        </div>
        {errors.fieldsOfInterest && (
          <Form.Control.Feedback type="invalid" className="d-block">
            {formatMessage(messages[errors.fieldsOfInterest] || messages.validationMinInterests)}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{formatMessage(messages.previousCoursesLabel)}</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={formData.previousCourses}
          onChange={(e) => updateFormData('previousCourses', e.target.value)}
          placeholder={formatMessage(messages.previousCoursesPlaceholder)}
        />
      </Form.Group>
    </div>
  );
};

InterestsStep.propTypes = {
  formData: PropTypes.shape({
    fieldsOfInterest: PropTypes.arrayOf(PropTypes.string),
    previousCourses: PropTypes.string,
  }).isRequired,
  updateFormData: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    fieldsOfInterest: PropTypes.string,
  }),
};

InterestsStep.defaultProps = {
  errors: {},
};

export default InterestsStep;
