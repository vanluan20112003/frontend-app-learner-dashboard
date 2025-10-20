import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';
import { GENDERS, FIELDS_OF_INTEREST } from '../constants';
import messages from '../messages';

const ProfessionalBasicInfoStep = ({ formData, updateFormData, errors }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="professional-basic-info-step">
      <h3 className="mb-4">{formatMessage(messages.professionalBasicInfo)}</h3>

      <Form.Group className="mb-3">
        <Form.Label>{formatMessage(messages.currentJobLabel)} *</Form.Label>
        <Form.Control
          type="text"
          value={formData.currentJob}
          onChange={(e) => updateFormData('currentJob', e.target.value)}
          placeholder={formatMessage(messages.currentJobPlaceholder)}
          isInvalid={!!errors.currentJob}
        />
        {errors.currentJob && (
          <Form.Control.Feedback type="invalid">
            {formatMessage(messages[errors.currentJob] || messages.validationRequired)}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{formatMessage(messages.genderLabel)} *</Form.Label>
        <Form.RadioSet
          name="gender"
          value={formData.gender}
          onChange={(e) => updateFormData('gender', e.target.value)}
        >
          <Form.Radio value={GENDERS.MALE}>
            {formatMessage(messages.genderMale)}
          </Form.Radio>
          <Form.Radio value={GENDERS.FEMALE}>
            {formatMessage(messages.genderFemale)}
          </Form.Radio>
          <Form.Radio value={GENDERS.OTHER}>
            {formatMessage(messages.genderOther)}
          </Form.Radio>
        </Form.RadioSet>
        {errors.gender && (
          <Form.Control.Feedback type="invalid" className="d-block">
            {formatMessage(messages[errors.gender] || messages.validationRequired)}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{formatMessage(messages.professionalFieldLabel)} *</Form.Label>
        <Form.Control
          as="select"
          value={formData.professionalField}
          onChange={(e) => updateFormData('professionalField', e.target.value)}
          isInvalid={!!errors.professionalField}
        >
          <option value="">Select a field...</option>
          {FIELDS_OF_INTEREST.map((field) => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </Form.Control>
        {errors.professionalField && (
          <Form.Control.Feedback type="invalid">
            {formatMessage(messages[errors.professionalField] || messages.validationRequired)}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </div>
  );
};

ProfessionalBasicInfoStep.propTypes = {
  formData: PropTypes.shape({
    currentJob: PropTypes.string,
    gender: PropTypes.string,
    professionalField: PropTypes.string,
  }).isRequired,
  updateFormData: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    currentJob: PropTypes.string,
    gender: PropTypes.string,
    professionalField: PropTypes.string,
  }),
};

ProfessionalBasicInfoStep.defaultProps = {
  errors: {},
};

export default ProfessionalBasicInfoStep;
