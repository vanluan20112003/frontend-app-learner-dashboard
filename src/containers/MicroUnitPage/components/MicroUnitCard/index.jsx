import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@openedx/paragon';

import MicroUnitCardImage from './components/MicroUnitCardImage';
import MicroUnitCardTitle from './components/MicroUnitCardTitle';
import MicroUnitCardDetails from './components/MicroUnitCardDetails';
import MicroUnitProgressBar from './components/MicroUnitProgressBar';
import MicroUnitBlocksList from './components/MicroUnitBlocksList';
import MicroUnitCardActions from './components/MicroUnitCardActions';

import './index.scss';

/**
 * MicroUnitCard component displays a micro unit in a card format
 * @param {Object} props
 * @param {Object} props.microUnit - Micro unit data
 * @param {string} props.courseName - Name of the course this micro unit belongs to
 */
export const MicroUnitCard = ({ microUnit, courseName }) => {
  // Get courseId from microUnit.courses array
  const courseId = microUnit.courses && microUnit.courses.length > 0
    ? microUnit.courses[0].course_id
    : null;

  return (
    <div className="micro-unit-card" data-testid="MicroUnitCard">
      <Card orientation="vertical" className="h-100">
        <MicroUnitCardImage
          microUnit={microUnit}
          courseId={courseId}
          microUnitId={microUnit.id}
          blocks={microUnit.blocks}
        />
        <Card.Body className="d-flex flex-column">
          <MicroUnitCardTitle microUnit={microUnit} courseName={courseName} />
          <Card.Section className="pt-3 pb-0 flex-grow-1">
            <MicroUnitCardDetails microUnit={microUnit} />
            {courseId && (
              <>
                <MicroUnitProgressBar
                  microUnit={microUnit}
                  orientation="horizontal"
                />
                <MicroUnitBlocksList
                  blocks={microUnit.blocks}
                  microUnitId={microUnit.id}
                  courseId={courseId}
                />
              </>
            )}
          </Card.Section>
          <Card.Footer className="mt-auto pt-3">
            <MicroUnitCardActions microUnit={microUnit} />
          </Card.Footer>
        </Card.Body>
      </Card>
    </div>
  );
};

MicroUnitCard.propTypes = {
  microUnit: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    thumbnail: PropTypes.string,
    thumbnail_url: PropTypes.string,
    thumbnail_display: PropTypes.string,
    estimated_duration: PropTypes.number,
    difficulty_level: PropTypes.string,
    total_blocks: PropTypes.number,
    is_active: PropTypes.bool,
    blocks: PropTypes.arrayOf(PropTypes.shape({
      block_usage_key: PropTypes.string,
      display_name: PropTypes.string,
    })),
    courses: PropTypes.arrayOf(PropTypes.shape({
      course_id: PropTypes.string,
    })),
  }).isRequired,
  courseName: PropTypes.string,
};

MicroUnitCard.defaultProps = {
  courseName: '',
};

export default MicroUnitCard;
