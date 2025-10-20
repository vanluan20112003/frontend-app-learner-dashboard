import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';
import { AGE_GROUPS } from '../constants';
import messages from '../messages';

const DemographicsStep = ({ formData, updateFormData, errors }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="demographics-step">
      <h3 className="mb-4">{formatMessage(messages.demographicsHeader)}</h3>

      <Form.Group className="mb-3">
        <Form.Label>{formatMessage(messages.ageGroupLabel)} *</Form.Label>
        <Form.RadioSet
          name="ageGroup"
          value={formData.ageGroup}
          onChange={(e) => updateFormData('ageGroup', e.target.value)}
        >
          {AGE_GROUPS.map((ageGroup) => (
            <Form.Radio key={ageGroup.value} value={ageGroup.value}>
              {ageGroup.label}
            </Form.Radio>
          ))}
        </Form.RadioSet>
        {errors.ageGroup && (
          <Form.Control.Feedback type="invalid" className="d-block">
            {formatMessage(messages[errors.ageGroup] || messages.validationRequired)}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    </div>
  );
};

DemographicsStep.propTypes = {
  formData: PropTypes.shape({
    ageGroup: PropTypes.string,
  }).isRequired,
  updateFormData: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    ageGroup: PropTypes.string,
  }),
};

DemographicsStep.defaultProps = {
  errors: {},
};

export default DemographicsStep;
