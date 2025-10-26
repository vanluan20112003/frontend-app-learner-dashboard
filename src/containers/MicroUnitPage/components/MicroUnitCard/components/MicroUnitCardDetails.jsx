import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@openedx/paragon';
import { AccessTime, ViewModule } from '@openedx/paragon/icons';

import { useFormatMicroUnitMeta } from '../../../hooks';

/**
 * MicroUnitCardDetails displays micro unit metadata (duration, blocks, description)
 */
const MicroUnitCardDetails = ({ microUnit }) => {
  const { description, estimated_duration, total_blocks } = microUnit;
  const { formatDuration, formatBlocksCount } = useFormatMicroUnitMeta();

  return (
    <div className="micro-unit-card-details">
      {description && (
        <p className="micro-unit-card-description">
          {description}
        </p>
      )}
      <div className="micro-unit-card-meta">
        {estimated_duration && (
          <div className="meta-item">
            <Icon src={AccessTime} className="meta-icon" />
            <span className="meta-text">{formatDuration(estimated_duration)}</span>
          </div>
        )}
        {total_blocks !== undefined && (
          <div className="meta-item">
            <Icon src={ViewModule} className="meta-icon" />
            <span className="meta-text">{formatBlocksCount(total_blocks)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

MicroUnitCardDetails.propTypes = {
  microUnit: PropTypes.shape({
    description: PropTypes.string,
    estimated_duration: PropTypes.number,
    total_blocks: PropTypes.number,
  }).isRequired,
};

export default MicroUnitCardDetails;
