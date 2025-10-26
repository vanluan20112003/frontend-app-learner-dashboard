import React from 'react';
import PropTypes from 'prop-types';

/**
 * MicroUnitCardTitle displays the title and optional course name
 */
const MicroUnitCardTitle = ({ microUnit, courseName }) => {
  const { title } = microUnit;

  return (
    <div className="micro-unit-card-title-container">
      <h3 className="micro-unit-card-title">{title}</h3>
      {courseName && (
        <p className="micro-unit-card-course-name text-muted small mb-0">
          {courseName}
        </p>
      )}
    </div>
  );
};

MicroUnitCardTitle.propTypes = {
  microUnit: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  courseName: PropTypes.string,
};

MicroUnitCardTitle.defaultProps = {
  courseName: '',
};

export default MicroUnitCardTitle;
