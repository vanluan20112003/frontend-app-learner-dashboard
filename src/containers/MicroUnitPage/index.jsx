import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { Container, Alert, Spinner } from '@openedx/paragon';

import {
  useInitializeMicroUnits,
  useFilterControls,
  useMicroUnitsData,
  useMicroUnitMessages,
} from './hooks';

import MicroUnitFilters from './components/MicroUnitFilters';
import CourseSection from './components/CourseSection';
import EmptyState from './components/EmptyState';

import messages from './messages';
import './index.scss';

/**
 * MicroUnitPage displays all micro units grouped by course
 * with search, filter, and sort functionality
 */
export const MicroUnitPage = () => {
  const { formatMessage } = useIntl();
  const microUnitMessages = useMicroUnitMessages();

  // Initialize micro units data
  const { initializeMicroUnits, isInitializing } = useInitializeMicroUnits();

  // Get filter controls
  const {
    filters,
    sortBy,
    handleSearchChange,
    handleDifficultyChange,
    handleSortChange,
    handleClearFilters,
  } = useFilterControls();

  // Get micro units data
  const {
    groupedMicroUnits,
    isLoading,
    error,
    hasActiveMicroUnits,
    filteredCount,
  } = useMicroUnitsData();

  // Check if there are active filters
  const hasActiveFilters = filters.search !== '' || filters.difficulty !== '';

  // Handle retry on error
  const handleRetry = () => {
    initializeMicroUnits();
  };

  // Handle navigate to discover courses
  const handleExploreCourses = () => {
    const lmsBaseUrl = getConfig().LMS_BASE_URL || '';
    window.location.href = `${lmsBaseUrl}/courses`;
  };

  // Render loading state (when initializing or loading)
  if (isInitializing || isLoading) {
    return (
      <Container size="xl" className="micro-unit-page">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p className="loading-text">{microUnitMessages.loading}</p>
        </div>
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container size="xl" className="micro-unit-page">
        <Alert variant="danger" className="error-alert">
          <Alert.Heading>{microUnitMessages.errorTitle}</Alert.Heading>
          <p>{microUnitMessages.errorDescription}</p>
          <div className="mt-3">
            <Alert.Link onClick={handleRetry}>
              {microUnitMessages.retryButton}
            </Alert.Link>
          </div>
        </Alert>
      </Container>
    );
  }

  // Render empty state if no active micro units (only after initialization is complete)
  if (!isInitializing && !hasActiveMicroUnits) {
    return (
      <Container size="xl" className="micro-unit-page">
        <div className="page-header">
          <h1 className="page-title">{formatMessage(messages.pageTitle)}</h1>
        </div>
        <EmptyState
          title={microUnitMessages.emptyStateTitle}
          description={microUnitMessages.emptyStateDescription}
          actionText={microUnitMessages.emptyStateAction}
          onAction={handleExploreCourses}
          variant="empty"
        />
      </Container>
    );
  }

  // Get course sections
  const courseSections = Object.values(groupedMicroUnits);

  // Render no results if filters applied but no matches (only after initialization is complete)
  if (!isInitializing && filteredCount === 0 && hasActiveFilters) {
    return (
      <Container size="xl" className="micro-unit-page">
        <div className="page-header">
          <h1 className="page-title">{formatMessage(messages.pageTitle)}</h1>
        </div>
        <MicroUnitFilters
          filters={filters}
          sortBy={sortBy}
          onSearchChange={handleSearchChange}
          onDifficultyChange={handleDifficultyChange}
          onSortChange={handleSortChange}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
        <EmptyState
          title={microUnitMessages.noResultsTitle}
          description={microUnitMessages.noResultsDescription}
          actionText={microUnitMessages.clearFilters}
          onAction={handleClearFilters}
          variant="no-results"
        />
      </Container>
    );
  }

  // Render micro units page
  return (
    <Container size="xl" className="micro-unit-page">
      <div className="page-header">
        <h1 className="page-title">{formatMessage(messages.pageTitle)}</h1>
        <p className="page-description">{formatMessage(messages.introDescription)}</p>
      </div>

      <MicroUnitFilters
        filters={filters}
        sortBy={sortBy}
        onSearchChange={handleSearchChange}
        onDifficultyChange={handleDifficultyChange}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="course-sections-container">
        {courseSections.map((section, index) => (
          <CourseSection
            key={section.course?.courseRun?.courseId || `section-${index}`}
            course={section.course}
            microUnits={section.microUnits}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </Container>
  );
};

MicroUnitPage.propTypes = {};

export default MicroUnitPage;
