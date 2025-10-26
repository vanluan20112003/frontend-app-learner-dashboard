import React from 'react';
import PropTypes from 'prop-types';
import { Collapsible, Icon } from '@openedx/paragon';
import { PlayCircleOutline, ExpandMore, ExpandLess } from '@openedx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';

import './MicroUnitBlocksList.scss';

/**
 * MicroUnitBlocksList displays a collapsible list of blocks/units in a micro unit
 */
const MicroUnitBlocksList = ({ blocks, microUnitId, courseId }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!blocks || blocks.length === 0) {
    return null;
  }

  const handleBlockClick = (block) => {
    // Navigate to the micro unit learning page with this block
    const { block_usage_key: blockUsageKey } = block;
    const learningBaseUrl = getConfig().LEARNING_BASE_URL || '';
    const microUnitUrl = `${learningBaseUrl}/learning/micro-units/${courseId}/${microUnitId}/${blockUsageKey}`;
    window.location.href = microUnitUrl;
  };

  return (
    <div className="micro-unit-blocks-list">
      <Collapsible
        title={(
          <div className="blocks-list-header">
            <span className="blocks-list-title">
              Units in this micro unit ({blocks.length})
            </span>
            <Icon
              src={isOpen ? ExpandLess : ExpandMore}
              className="blocks-list-icon"
            />
          </div>
        )}
        open={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        className="blocks-list-collapsible"
      >
        <div className="blocks-list-content">
          {blocks.map((block, index) => (
            <div
              key={block.id || index}
              className="block-item"
              onClick={() => handleBlockClick(block)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleBlockClick(block);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="block-item-number">
                {index + 1}
              </div>
              <div className="block-item-content">
                <div className="block-item-name">
                  {block.display_name}
                </div>
              </div>
              <Icon
                src={PlayCircleOutline}
                className="block-item-icon"
              />
            </div>
          ))}
        </div>
      </Collapsible>
    </div>
  );
};

MicroUnitBlocksList.propTypes = {
  blocks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    block_usage_key: PropTypes.string.isRequired,
    display_name: PropTypes.string.isRequired,
    order_in_micro_unit: PropTypes.number,
  })),
  microUnitId: PropTypes.number.isRequired,
  courseId: PropTypes.string.isRequired,
};

MicroUnitBlocksList.defaultProps = {
  blocks: [],
};

export default MicroUnitBlocksList;
