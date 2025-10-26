import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Stack, Icon } from '@openedx/paragon';
import { School, Work, MenuBook } from '@openedx/paragon/icons';
import messages from '../messages';

const WelcomeStep = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="welcome-step">
      <Stack gap={4}>
        <div className="text-center d-flex justify-content-center">
          <Icon src={School} className="text-primary" style={{ width: 64, height: 64 }} />
        </div>
        
        <div className="text-center">
          <h3 className="mb-3">{formatMessage(messages.welcomeTitle)}</h3>
          <p className="text-muted mb-4">
            {formatMessage(messages.welcomeDescription)}
          </p>
        </div>

        <div className="welcome-benefits">
          <Stack gap={3}>
            <div className="d-flex align-items-start">
              <Icon src={School} className="text-primary mr-3 mt-1" />
              <div>
                <strong>{formatMessage(messages.welcomeBenefit1Title)}</strong>
                <p className="text-muted small mb-0">
                  {formatMessage(messages.welcomeBenefit1Description)}
                </p>
              </div>
            </div>

            <div className="d-flex align-items-start">
              <Icon src={Work} className="text-primary mr-3 mt-1" />
              <div>
                <strong>{formatMessage(messages.welcomeBenefit2Title)}</strong>
                <p className="text-muted small mb-0">
                  {formatMessage(messages.welcomeBenefit2Description)}
                </p>
              </div>
            </div>

            <div className="d-flex align-items-start">
              <Icon src={MenuBook} className="text-primary mr-3 mt-1" />
              <div>
                <strong>{formatMessage(messages.welcomeBenefit3Title)}</strong>
                <p className="text-muted small mb-0">
                  {formatMessage(messages.welcomeBenefit3Description)}
                </p>
              </div>
            </div>
          </Stack>
        </div>

        <div className="text-center text-muted small">
          <p className="mb-0">{formatMessage(messages.welcomeDisclaimer)}</p>
        </div>
      </Stack>
    </div>
  );
};

export default WelcomeStep;