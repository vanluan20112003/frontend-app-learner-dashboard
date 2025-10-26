import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@openedx/paragon';
import { PlayCircleOutline } from '@openedx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';

import { useMicroUnitMessages } from '../../../hooks';

/**
 * MicroUnitCardActions displays action buttons for the micro unit
 */
const MicroUnitCardActions = ({ microUnit }) => {
  const { startLearning } = useMicroUnitMessages();
  const { id, blocks, courses } = microUnit;

  const handleStartLearning = () => {
    // Navigate to micro unit learning page
    // URL format: /learning/micro-units/{courseId}/{microUnitId}/{firstBlockUsageKey}
    if (blocks && blocks.length > 0 && courses && courses.length > 0) {
      const firstBlock = blocks[0];
      const courseId = courses[0].course_id;
      const blockUsageKey = firstBlock.block_usage_key;

      const learningBaseUrl = getConfig().LEARNING_BASE_URL || '';
      const microUnitUrl = `${learningBaseUrl}/learning/micro-units/${courseId}/${id}/${blockUsageKey}`;

      console.log(`[MicroUnit] Navigating to: ${microUnitUrl}`);
      window.location.href = microUnitUrl;
    } else {
      // Fallback: show warning if no blocks available
      console.warn(`[MicroUnit] Cannot navigate - micro unit ${id} has no blocks or courses`);
    }
  };

  return (
    <div className="micro-unit-card-actions">
      <Button
        variant="primary"
        iconBefore={PlayCircleOutline}
        onClick={handleStartLearning}
        className="w-100"
        disabled={!blocks || blocks.length === 0 || !courses || courses.length === 0}
      >
        {startLearning}
      </Button>
    </div>
  );
};

MicroUnitCardActions.propTypes = {
  microUnit: PropTypes.shape({
    id: PropTypes.number.isRequired,
    blocks: PropTypes.arrayOf(PropTypes.shape({
      block_usage_key: PropTypes.string,
      lms_web_url: PropTypes.string,
    })),
    courses: PropTypes.arrayOf(PropTypes.shape({
      course_id: PropTypes.string,
    })),
  }).isRequired,
};

export default MicroUnitCardActions;
