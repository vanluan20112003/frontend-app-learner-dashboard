import React from 'react';
import PropTypes from 'prop-types';
import { Collapsible, Badge, Icon } from '@openedx/paragon';
import { ExpandMore, ExpandLess } from '@openedx/paragon/icons';

import MicroUnitCard from '../MicroUnitCard';
import { useFormatMicroUnitMeta } from '../../hooks';

import './index.scss';

/**
 * CourseSection component displays a collapsible section with micro units for a specific course
 * @param {Object} props
 * @param {Object} props.course - Course data
 * @param {Array} props.microUnits - Array of micro units for this course
 * @param {boolean} props.defaultOpen - Whether section is open by default
 */
export const CourseSection = ({ course, microUnits, defaultOpen }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const { formatMicroUnitsCount } = useFormatMicroUnitMeta();

  const courseName = course?.course?.courseName || course?.courseName || 'Course';
  const microUnitsCount = microUnits?.length || 0;

  if (microUnitsCount === 0) {
    return null;
  }

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="course-section" data-testid="CourseSection">
      <Collapsible
        title={(
          <div className="course-section-header">
            <div className="course-section-title-container">
              <h2 className="course-section-title">{courseName}</h2>
              <Badge variant="light" className="course-section-badge">
                {formatMicroUnitsCount(microUnitsCount)}
              </Badge>
            </div>
            <Icon
              src={isOpen ? ExpandLess : ExpandMore}
              className="course-section-icon"
            />
          </div>
        )}
        open={isOpen}
        onToggle={toggleSection}
        className="course-section-collapsible"
      >
        <div className="course-section-content">
          <div className="micro-units-grid">
            {microUnits.map((microUnit) => (
              <MicroUnitCard
                key={microUnit.id}
                microUnit={microUnit}
                courseName={courseName}
              />
            ))}
          </div>
        </div>
      </Collapsible>
    </div>
  );
};

CourseSection.propTypes = {
  course: PropTypes.shape({
    course: PropTypes.shape({
      courseName: PropTypes.string,
    }),
    courseName: PropTypes.string,
  }).isRequired,
  microUnits: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultOpen: PropTypes.bool,
};

CourseSection.defaultProps = {
  defaultOpen: true,
};

export default CourseSection;
