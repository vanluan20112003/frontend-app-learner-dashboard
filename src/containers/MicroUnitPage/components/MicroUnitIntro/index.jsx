import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon, Stack } from '@openedx/paragon';
import { Speed, Schedule, TrendingUp } from '@openedx/paragon/icons';
import messages from '../../messages';

import './index.scss';

/**
 * MicroUnitIntro component
 * Hiển thị phần giới thiệu về tính năng Micro Units
 */
const MicroUnitIntro = () => {
  const { formatMessage } = useIntl();

  const benefits = [
    {
      icon: Speed,
      title: formatMessage(messages.introBenefit1Title),
      description: formatMessage(messages.introBenefit1Description),
    },
    {
      icon: Schedule,
      title: formatMessage(messages.introBenefit2Title),
      description: formatMessage(messages.introBenefit2Description),
    },
    {
      icon: TrendingUp,
      title: formatMessage(messages.introBenefit3Title),
      description: formatMessage(messages.introBenefit3Description),
    },
  ];

  return (
    <div className="micro-unit-intro">
      <div className="intro-content">
        <div className="intro-text">
          <h3 className="intro-title">
            {formatMessage(messages.introTitle)}
          </h3>
          <p className="intro-description">
            {formatMessage(messages.introDescription)}
          </p>
        </div>

        <div className="benefits-container">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <Icon src={benefit.icon} className="benefit-icon" />
              <span className="benefit-text">
                <strong>{benefit.title}:</strong> {benefit.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MicroUnitIntro;
