import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';
import { Search } from '@openedx/paragon/icons';

import messages from './messages';

/**
 * CourseSearchBar - Search input for filtering courses
 * Allows users to search courses by title, code, or description
 */
export const CourseSearchBar = ({ onSearch, placeholder }) => {
  const { formatMessage } = useIntl();
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch('');
  };

  return (
    <div className="course-search-bar">
      <Form.Group className="mb-0">
        <div className="search-input-wrapper">
          <Form.Control
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            placeholder={placeholder || formatMessage(messages.searchCourses)}
            className="course-search-input"
          />
          {searchValue && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClear}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </Form.Group>
    </div>
  );
};

CourseSearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

CourseSearchBar.defaultProps = {
  placeholder: null,
};

export default CourseSearchBar;
