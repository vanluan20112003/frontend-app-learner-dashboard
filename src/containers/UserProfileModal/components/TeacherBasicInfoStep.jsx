import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';
import { GENDERS } from '../constants';
import messages from '../messages';

const TeacherBasicInfoStep = ({ formData, updateFormData, errors }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="teacher-basic-info-step">
      <h3 className="mb-4">{formatMessage(messages.teacherBasicInfo)}</h3>

      <Form.Group className="mb-3">
        <Form.Label>{formatMessage(messages.teachingSubjectLabel)} *</Form.Label>
        <Form.Control
          type="text"
          value={formData.teachingSubject}
          onChange={(e) => updateFormData('teachingSubject', e.target.value)}
          placeholder={formatMessage(messages.teachingSubjectPlaceholder)}
          isInvalid={!!errors.teachingSubject}
        />
        {errors.teachingSubject && (
          <Form.Control.Feedback type="invalid">
            {formatMessage(messages[errors.teachingSubject] || messages.validationRequired)}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{formatMessage(messages.teachingSchoolLabel)} *</Form.Label>
        <Form.Control
          type="text"
          value={formData.teachingSchool}
          onChange={(e) => updateFormData('teachingSchool', e.target.value)}
          placeholder={formatMessage(messages.schoolPlaceholder)}
          isInvalid={!!errors.teachingSchool}
        />
        {errors.teachingSchool && (
          <Form.Control.Feedback type="invalid">
            {formatMessage(messages[errors.teachingSchool] || messages.validationRequired)}
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
    </div>
  );
};

TeacherBasicInfoStep.propTypes = {
  formData: PropTypes.shape({
    teachingSubject: PropTypes.string,
    teachingSchool: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
  updateFormData: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    teachingSubject: PropTypes.string,
    teachingSchool: PropTypes.string,
    gender: PropTypes.string,
  }),
};

TeacherBasicInfoStep.defaultProps = {
  errors: {},
};

export default TeacherBasicInfoStep;
