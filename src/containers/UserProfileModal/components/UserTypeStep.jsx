import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';
import { USER_TYPES } from '../constants';
import messages from '../messages';

const UserTypeStep = ({ userType, setUserType, error }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="user-type-step">
      <h3 className="mb-4">{formatMessage(messages.selectUserType)}</h3>
      <Form.RadioSet
        name="userType"
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
      >
        <Form.Radio value={USER_TYPES.STUDENT}>
          {formatMessage(messages.userTypeStudent)}
        </Form.Radio>
        <Form.Radio value={USER_TYPES.PROFESSIONAL}>
          {formatMessage(messages.userTypeProfessional)}
        </Form.Radio>
        <Form.Radio value={USER_TYPES.TEACHER}>
          {formatMessage(messages.userTypeTeacher)}
        </Form.Radio>
      </Form.RadioSet>
      {error && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {formatMessage(messages[error] || messages.validationRequired)}
        </Form.Control.Feedback>
      )}
    </div>
  );
};

UserTypeStep.propTypes = {
  userType: PropTypes.string,
  setUserType: PropTypes.func.isRequired,
  error: PropTypes.string,
};

UserTypeStep.defaultProps = {
  userType: null,
  error: null,
};

export default UserTypeStep;
