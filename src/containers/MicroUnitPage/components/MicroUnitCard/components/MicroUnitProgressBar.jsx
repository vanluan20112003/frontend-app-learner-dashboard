import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ProgressBar, IconButton, Icon } from '@openedx/paragon';
import { Refresh } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';
import { fetchCourseUnits } from 'data/services/lms/api';
import messages from '../../../messages';

import './MicroUnitProgressBar.scss';

/**
 * MicroUnitProgressBar component
 * Hiển thị tiến độ hoàn thành của micro unit dựa trên blocks đã complete
 */
const MicroUnitProgressBar = ({ microUnit, orientation }) => {
  const { formatMessage } = useIntl();
  const [progressData, setProgressData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const courseId = microUnit.courses && microUnit.courses.length > 0
    ? microUnit.courses[0].course_id
    : null;

  const blocks = microUnit.blocks || [];
  const totalBlocks = blocks.length;

  useEffect(() => {
    const fetchProgress = async () => {
      if (!courseId || totalBlocks === 0) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch course units with completion status
        console.log('🔍 Fetching course units for:', courseId);
        const response = await fetchCourseUnits(courseId);

        console.log('📦 Raw API Response:', response);
        console.log('📦 Response.data:', response?.data);

        // Handle different response structures
        let courseUnits = [];
        if (response?.data?.units) {
          courseUnits = response.data.units;
        } else if (response?.units) {
          courseUnits = response.units;
        } else if (Array.isArray(response?.data)) {
          courseUnits = response.data;
        } else if (Array.isArray(response)) {
          courseUnits = response;
        }

        console.log('🔍 DEBUG Progress Bar:', {
          microUnitId: microUnit.id,
          courseId,
          totalBlocks,
          courseUnitsCount: courseUnits.length,
          blocks: blocks.map(b => ({
            key: b.block_usage_key,
            name: b.display_name,
          })),
        });

        // Create a map of block_usage_key to completion status
        const completionMap = {};
        courseUnits.forEach((unit) => {
          completionMap[unit.id] = unit.complete;
        });

        console.log('📊 Completion Map Sample:',
          Object.entries(completionMap).slice(0, 3)
        );

        // Count completed blocks in this micro unit
        let completedCount = 0;
        const blockStatus = [];
        blocks.forEach((block) => {
          const isComplete = completionMap[block.block_usage_key] === true;
          if (isComplete) {
            completedCount += 1;
          }
          blockStatus.push({
            blockKey: block.block_usage_key,
            displayName: block.display_name,
            isComplete,
          });
        });

        console.log('✅ Block Status:', blockStatus);
        console.log(`📈 Progress: ${completedCount}/${totalBlocks} (${Math.round((completedCount / totalBlocks) * 100)}%)`);

        // Calculate percentage
        const percentage = totalBlocks > 0
          ? Math.round((completedCount / totalBlocks) * 100)
          : 0;

        setProgressData({
          completed: completedCount,
          total: totalBlocks,
          percentage,
        });
      } catch (error) {
        console.error('❌ Error fetching progress:', error);
        // Set default progress data on error
        setProgressData({
          completed: 0,
          total: totalBlocks,
          percentage: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [courseId, totalBlocks, blocks, refreshKey]);

  // Auto-refresh when window gains focus (user returns to page)
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 Window focused, refreshing progress...');
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Manual refresh function
  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
  };

  // Don't render if no blocks
  if (totalBlocks === 0) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={`micro-unit-progress-bar ${orientation}`}>
        <div className="progress-loading">
          <span className="small text-muted">Loading progress...</span>
        </div>
      </div>
    );
  }

  // Don't render if no progress data
  if (!progressData) {
    return null;
  }

  const { completed, total, percentage } = progressData;

  // Determine variant based on percentage
  let variant = 'primary';
  if (percentage === 100) {
    variant = 'success';
  } else if (percentage >= 50) {
    variant = 'info';
  }

  return (
    <div className={`micro-unit-progress-bar ${orientation}`}>
      <div className="progress-header">
        <div className="progress-header-left">
          <span className="progress-label small text-muted">
            {formatMessage(messages.progressLabel)}
          </span>
          <IconButton
            src={Refresh}
            iconAs={Icon}
            alt="Refresh progress"
            size="sm"
            variant="link"
            onClick={handleRefresh}
            className="refresh-button"
            disabled={isLoading}
          />
        </div>
        <span className="progress-text small">
          {formatMessage(messages.progressCompleted, { completed, total })}
        </span>
      </div>
      <ProgressBar
        now={percentage}
        variant={variant}
        className="progress-bar-component"
        label={`${percentage}%`}
        visuallyHidden={false}
      />
      <div className="progress-percentage small text-muted text-right">
        {formatMessage(messages.progressPercentage, { percentage })}
      </div>
    </div>
  );
};

MicroUnitProgressBar.propTypes = {
  microUnit: PropTypes.shape({
    id: PropTypes.number.isRequired,
    blocks: PropTypes.arrayOf(PropTypes.shape({
      block_usage_key: PropTypes.string.isRequired,
      display_name: PropTypes.string,
    })),
    courses: PropTypes.arrayOf(PropTypes.shape({
      course_id: PropTypes.string,
    })),
  }).isRequired,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
};

MicroUnitProgressBar.defaultProps = {
  orientation: 'horizontal',
};

export default MicroUnitProgressBar;
