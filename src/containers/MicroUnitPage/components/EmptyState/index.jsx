import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@openedx/paragon';
import { Search } from '@openedx/paragon/icons';

import './index.scss';

/**
 * EmptyState component displays a message when no micro units are found
 * @param {Object} props
 * @param {string} props.title - Title message
 * @param {string} props.description - Description message
 * @param {string} props.actionText - Button text (optional)
 * @param {Function} props.onAction - Button click handler (optional)
 * @param {string} props.variant - Variant: 'empty' or 'no-results'
 */
export const EmptyState = ({
  title,
  description,
  actionText,
  onAction,
  variant,
}) => (
  <div className="micro-unit-empty-state">
    <div className="empty-state-content">
      <div className="empty-state-icon">
        <Search style={{ fontSize: '64px', color: '#C7C7C7' }} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionText && onAction && (
        <Button
          variant={variant === 'no-results' ? 'outline-primary' : 'primary'}
          onClick={onAction}
          className="empty-state-action"
        >
          {actionText}
        </Button>
      )}
    </div>
  </div>
);

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  variant: PropTypes.oneOf(['empty', 'no-results']),
};

EmptyState.defaultProps = {
  actionText: null,
  onAction: null,
  variant: 'empty',
};

export default EmptyState;
