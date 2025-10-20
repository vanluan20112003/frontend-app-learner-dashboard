import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';
import {
  EDUCATION_LEVELS,
  ACADEMIC_YEARS,
  GENDERS,
  GPA_LEVELS,
} from '../constants';
import messages from '../messages';

const StudentBasicInfoStep = ({ formData, updateFormData, errors }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="student-basic-info-step">
      <h3 className="mb-4">{formatMessage(messages.studentBasicInfo)}</h3>

      <Form.Group className="mb-3">
        <Form.Label>{formatMessage(messages.schoolLabel)} *</Form.Label>
        <Form.Control
          type="text"
          value={formData.school}
          onChange={(e) => updateFormData('school', e.target.value)}
          placeholder={formatMessage(messages.schoolPlaceholder)}
          isInvalid={!!errors.school}
        />
        {errors.school && (
          <Form.Control.Feedback type="invalid">
            {formatMessage(messages[errors.school] || messages.validationRequired)}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{formatMessage(messages.facultyLabel)} *</Form.Label>
        <Form.Control
          type="text"
          value={formData.faculty}
          onChange={(e) => updateFormData('faculty', e.target.value)}
          placeholder={formatMessage(messages.facultyPlaceholder)}
          isInvalid={!!errors.faculty}
        />
        {errors.faculty && (
          <Form.Control.Feedback type="invalid">
            {formatMessage(messages[errors.faculty] || messages.validationRequired)}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{formatMessage(messages.majorLabel)}</Form.Label>
        <Form.Control
          type="text"
          value={formData.major}
          onChange={(e) => updateFormData('major', e.target.value)}
          placeholder={formatMessage(messages.majorPlaceholder)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>{formatMessage(messages.educationLevelLabel)} *</Form.Label>
        <Form.RadioSet
          name="educationLevel"
          value={formData.educationLevel}
          onChange={(e) => updateFormData('educationLevel', e.target.value)}
        >
          <Form.Radio value={EDUCATION_LEVELS.BACHELOR}>
            {formatMessage(messages.educationLevelBachelor)}
          </Form.Radio>
          <Form.Radio value={EDUCATION_LEVELS.MASTER}>
            {formatMessage(messages.educationLevelMaster)}
          </Form.Radio>
          <Form.Radio value={EDUCATION_LEVELS.OTHER}>
            {formatMessage(messages.educationLevelOther)}
          </Form.Radio>
        </Form.RadioSet>
        {errors.educationLevel && (
          <Form.Control.Feedback type="invalid" className="d-block">
            {formatMessage(messages[errors.educationLevel] || messages.validationRequired)}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      {formData.educationLevel === EDUCATION_LEVELS.BACHELOR && (
        <Form.Group className="mb-3">
          <Form.Label>{formatMessage(messages.academicYearLabel)} *</Form.Label>
          <Form.RadioSet
            name="academicYear"
            value={formData.academicYear}
            onChange={(e) => updateFormData('academicYear', e.target.value)}
          >
            <Form.Radio value={ACADEMIC_YEARS.YEAR_1}>
              {formatMessage(messages.yearOne)}
            </Form.Radio>
            <Form.Radio value={ACADEMIC_YEARS.YEAR_2}>
              {formatMessage(messages.yearTwo)}
            </Form.Radio>
            <Form.Radio value={ACADEMIC_YEARS.YEAR_3}>
              {formatMessage(messages.yearThree)}
            </Form.Radio>
            <Form.Radio value={ACADEMIC_YEARS.YEAR_4_PLUS}>
              {formatMessage(messages.yearFourPlus)}
            </Form.Radio>
          </Form.RadioSet>
          {errors.academicYear && (
            <Form.Control.Feedback type="invalid" className="d-block">
              {formatMessage(messages[errors.academicYear] || messages.validationRequired)}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      )}

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
        <Form.Label>{formatMessage(messages.gpaLabel)}</Form.Label>
        <Form.RadioSet
          name="gpa"
          value={formData.gpa || ''}
          onChange={(e) => updateFormData('gpa', e.target.value)}
        >
          <Form.Radio value={GPA_LEVELS.WEAK}>
            {formatMessage(messages.gpaWeak)}
          </Form.Radio>
          <Form.Radio value={GPA_LEVELS.AVERAGE}>
            {formatMessage(messages.gpaAverage)}
          </Form.Radio>
          <Form.Radio value={GPA_LEVELS.GOOD}>
            {formatMessage(messages.gpaGood)}
          </Form.Radio>
          <Form.Radio value={GPA_LEVELS.EXCELLENT}>
            {formatMessage(messages.gpaExcellent)}
          </Form.Radio>
        </Form.RadioSet>
      </Form.Group>
    </div>
  );
};

StudentBasicInfoStep.propTypes = {
  formData: PropTypes.shape({
    school: PropTypes.string,
    faculty: PropTypes.string,
    major: PropTypes.string,
    educationLevel: PropTypes.string,
    academicYear: PropTypes.string,
    gender: PropTypes.string,
    gpa: PropTypes.string,
  }).isRequired,
  updateFormData: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    school: PropTypes.string,
    faculty: PropTypes.string,
    educationLevel: PropTypes.string,
    academicYear: PropTypes.string,
    gender: PropTypes.string,
  }),
};

StudentBasicInfoStep.defaultProps = {
  errors: {},
};

export default StudentBasicInfoStep;
