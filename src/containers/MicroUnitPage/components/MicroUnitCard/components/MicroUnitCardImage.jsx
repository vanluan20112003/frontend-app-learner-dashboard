import React from 'react';
import PropTypes from 'prop-types';
import { Card, Badge } from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';

/**
 * MicroUnitCardImage displays the thumbnail image with difficulty badge overlay
 */
const MicroUnitCardImage = ({ microUnit, courseId, microUnitId, blocks }) => {
  const { thumbnail_display, thumbnail_url, thumbnail, difficulty_level, title } = microUnit;

  const imageUrl = thumbnail_display || thumbnail_url || thumbnail || '/static/images/course-placeholder.png';

  const getDifficultyVariant = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'Easy';
      case 'medium':
        return 'Medium';
      case 'hard':
        return 'Hard';
      default:
        return '';
    }
  };

  const handleImageClick = () => {
    // Navigate to the first block in the micro unit
    if (blocks && blocks.length > 0 && courseId && microUnitId) {
      const firstBlock = blocks[0];
      const learningBaseUrl = getConfig().LEARNING_BASE_URL || '';
      // Check if learningBaseUrl already ends with /learning
      const baseUrl = learningBaseUrl.endsWith('/learning') ? learningBaseUrl : `${learningBaseUrl}/learning`;
      const microUnitUrl = `${baseUrl}/micro-units/${courseId}/${microUnitId}/${firstBlock.block_usage_key}`;
      window.location.href = microUnitUrl;
    }
  };

  return (
    <div
      className="micro-unit-card-image-container"
      onClick={handleImageClick}
      style={{ cursor: blocks && blocks.length > 0 ? 'pointer' : 'default' }}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleImageClick();
        }
      }}
    >
      <Card.ImageCap
        src={imageUrl}
        srcAlt={title}
        logoAlt=""
        className="micro-unit-card-image"
      />
      {difficulty_level && (
        <div className="micro-unit-card-badge">
          <Badge variant={getDifficultyVariant(difficulty_level)}>
            {getDifficultyLabel(difficulty_level)}
          </Badge>
        </div>
      )}
    </div>
  );
};

MicroUnitCardImage.propTypes = {
  microUnit: PropTypes.shape({
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    thumbnail_url: PropTypes.string,
    thumbnail_display: PropTypes.string,
    difficulty_level: PropTypes.string,
  }).isRequired,
  courseId: PropTypes.string,
  microUnitId: PropTypes.number,
  blocks: PropTypes.arrayOf(PropTypes.shape({
    block_usage_key: PropTypes.string.isRequired,
    display_name: PropTypes.string.isRequired,
  })),
};

MicroUnitCardImage.defaultProps = {
  courseId: null,
  microUnitId: null,
  blocks: [],
};

export default MicroUnitCardImage;
