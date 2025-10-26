import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Button,
  Icon,
  SearchField,
} from '@openedx/paragon';
import { Close } from '@openedx/paragon/icons';

import { useMicroUnitMessages } from '../../hooks';

import './index.scss';

/**
 * MicroUnitFilters component provides search, filter, and sort controls
 * @param {Object} props
 * @param {Object} props.filters - Current filter values
 * @param {string} props.sortBy - Current sort value
 * @param {Function} props.onSearchChange - Handler for search change
 * @param {Function} props.onDifficultyChange - Handler for difficulty filter change
 * @param {Function} props.onSortChange - Handler for sort change
 * @param {Function} props.onClearFilters - Handler for clearing filters
 * @param {boolean} props.hasActiveFilters - Whether there are active filters
 */
export const MicroUnitFilters = ({
  filters,
  sortBy,
  onSearchChange,
  onDifficultyChange,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  const messages = useMicroUnitMessages();
  const [searchValue, setSearchValue] = React.useState(filters.search || '');

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handleSearchClear = () => {
    setSearchValue('');
    onSearchChange('');
  };

  return (
    <div className="micro-unit-filters" data-testid="MicroUnitFilters">
      <div className="filters-row">
        <div className="search-container">
          <SearchField
            onSubmit={handleSearchChange}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            value={searchValue}
            placeholder={messages.searchPlaceholder}
            className="micro-unit-search"
          />
        </div>

        <div className="filters-controls">
          <Form.Group className="filter-group">
            <Form.Control
              as="select"
              value={filters.difficulty || ''}
              onChange={(e) => onDifficultyChange(e.target.value)}
              className="difficulty-filter"
            >
              {messages.difficultyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="filter-group">
            <Form.Control
              as="select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="sort-select"
            >
              {messages.sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {hasActiveFilters && (
            <Button
              variant="outline-primary"
              iconBefore={Close}
              onClick={onClearFilters}
              className="clear-filters-btn"
            >
              {messages.clearFilters}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

MicroUnitFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    difficulty: PropTypes.string,
    isActive: PropTypes.bool,
  }).isRequired,
  sortBy: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onDifficultyChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  hasActiveFilters: PropTypes.bool,
};

MicroUnitFilters.defaultProps = {
  hasActiveFilters: false,
};

export default MicroUnitFilters;
