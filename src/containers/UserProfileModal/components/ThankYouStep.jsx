import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Stack, Icon } from '@openedx/paragon';
import { CheckCircle } from '@openedx/paragon/icons';
import messages from '../messages';

const ThankYouStep = ({ userType }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="thank-you-step">
      <Stack gap={4}>
        <div className="text-center d-flex justify-content-center">
          <Icon 
            src={CheckCircle} 
            className="text-success mb-3" 
            style={{ width: 80, height: 80 }} 
          />
        </div>
        
        <div className="text-center">
          <h3 className="mb-3">{formatMessage(messages.thankYouTitle)}</h3>
          <p className="text-muted mb-4">
            {formatMessage(messages.thankYouDescription)}
          </p>
        </div>

        <div className="thank-you-summary bg-light-200 p-4 rounded">
          <Stack gap={3}>
            <div>
              <strong className="d-block mb-2">
                {formatMessage(messages.thankYouSummaryTitle)}
              </strong>
              <ul className="list-unstyled mb-0">
                <li className="text-muted small mb-1">
                  ✓ {formatMessage(messages.thankYouBenefit1)}
                </li>
                <li className="text-muted small mb-1">
                  ✓ {formatMessage(messages.thankYouBenefit2)}
                </li>
                <li className="text-muted small mb-1">
                  ✓ {formatMessage(messages.thankYouBenefit3)}
                </li>
              </ul>
            </div>
          </Stack>
        </div>

        <div className="text-center">
          <p className="text-muted small mb-0">
            {formatMessage(messages.thankYouClosingMessage)}
          </p>
        </div>
      </Stack>
    </div>
  );
};

ThankYouStep.propTypes = {
  userType: PropTypes.string,
};

ThankYouStep.defaultProps = {
  userType: null,
};

export default ThankYouStep;