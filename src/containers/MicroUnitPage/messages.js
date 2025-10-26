import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  pageTitle: {
    id: 'microUnitPage.pageTitle',
    defaultMessage: 'My Micro Units',
    description: 'Title for the Micro Units page',
  },
  searchPlaceholder: {
    id: 'microUnitPage.searchPlaceholder',
    defaultMessage: 'Search micro units...',
    description: 'Placeholder text for search input',
  },
  filterButton: {
    id: 'microUnitPage.filterButton',
    defaultMessage: 'Filters',
    description: 'Button text for filters',
  },
  sortBy: {
    id: 'microUnitPage.sortBy',
    defaultMessage: 'Sort by',
    description: 'Label for sort dropdown',
  },
  sortByTitle: {
    id: 'microUnitPage.sortByTitle',
    defaultMessage: 'Title',
    description: 'Sort option: Title',
  },
  sortByDuration: {
    id: 'microUnitPage.sortByDuration',
    defaultMessage: 'Duration',
    description: 'Sort option: Duration',
  },
  sortByDifficulty: {
    id: 'microUnitPage.sortByDifficulty',
    defaultMessage: 'Difficulty',
    description: 'Sort option: Difficulty',
  },
  sortByOrder: {
    id: 'microUnitPage.sortByOrder',
    defaultMessage: 'Order',
    description: 'Sort option: Order',
  },
  difficultyLabel: {
    id: 'microUnitPage.difficultyLabel',
    defaultMessage: 'Difficulty',
    description: 'Label for difficulty filter',
  },
  difficultyAll: {
    id: 'microUnitPage.difficultyAll',
    defaultMessage: 'All Levels',
    description: 'Option for all difficulty levels',
  },
  difficultyEasy: {
    id: 'microUnitPage.difficultyEasy',
    defaultMessage: 'Easy',
    description: 'Easy difficulty level',
  },
  difficultyMedium: {
    id: 'microUnitPage.difficultyMedium',
    defaultMessage: 'Medium',
    description: 'Medium difficulty level',
  },
  difficultyHard: {
    id: 'microUnitPage.difficultyHard',
    defaultMessage: 'Hard',
    description: 'Hard difficulty level',
  },
  microUnitsCount: {
    id: 'microUnitPage.microUnitsCount',
    defaultMessage: '{count} {count, plural, one {Micro Unit} other {Micro Units}}',
    description: 'Count of micro units',
  },
  estimatedDuration: {
    id: 'microUnitPage.estimatedDuration',
    defaultMessage: '{duration} min',
    description: 'Estimated duration in minutes',
  },
  blocksCount: {
    id: 'microUnitPage.blocksCount',
    defaultMessage: '{count} {count, plural, one {block} other {blocks}}',
    description: 'Number of blocks in micro unit',
  },
  startLearning: {
    id: 'microUnitPage.startLearning',
    defaultMessage: 'Start Learning',
    description: 'Button text to start a micro unit',
  },
  viewDetails: {
    id: 'microUnitPage.viewDetails',
    defaultMessage: 'View Details',
    description: 'Button text to view micro unit details',
  },
  emptyStateTitle: {
    id: 'microUnitPage.emptyStateTitle',
    defaultMessage: 'No micro units found',
    description: 'Title for empty state',
  },
  emptyStateDescription: {
    id: 'microUnitPage.emptyStateDescription',
    defaultMessage: 'You don\'t have any micro units yet. Explore courses to find micro units to learn from.',
    description: 'Description for empty state',
  },
  emptyStateAction: {
    id: 'microUnitPage.emptyStateAction',
    defaultMessage: 'Explore Courses',
    description: 'Button text for empty state action',
  },
  noResultsTitle: {
    id: 'microUnitPage.noResultsTitle',
    defaultMessage: 'No results found',
    description: 'Title when search/filter returns no results',
  },
  noResultsDescription: {
    id: 'microUnitPage.noResultsDescription',
    defaultMessage: 'Try adjusting your filters or search terms',
    description: 'Description when no results found',
  },
  clearFilters: {
    id: 'microUnitPage.clearFilters',
    defaultMessage: 'Clear Filters',
    description: 'Button to clear all filters',
  },
  loading: {
    id: 'microUnitPage.loading',
    defaultMessage: 'Loading micro units...',
    description: 'Loading state message',
  },
  errorTitle: {
    id: 'microUnitPage.errorTitle',
    defaultMessage: 'Unable to load micro units',
    description: 'Error title',
  },
  errorDescription: {
    id: 'microUnitPage.errorDescription',
    defaultMessage: 'There was an error loading your micro units. Please try again later.',
    description: 'Error description',
  },
  retryButton: {
    id: 'microUnitPage.retryButton',
    defaultMessage: 'Retry',
    description: 'Button to retry loading',
  },
  // Introduction section messages
  introTitle: {
    id: 'microUnitPage.introTitle',
    defaultMessage: 'Học theo từng chủ đề nhỏ, tiến bộ từng ngày',
    description: 'Introduction title for micro units feature',
  },
  introDescription: {
    id: 'microUnitPage.introDescription',
    defaultMessage: 'Bạn không muốn hoàn thành một lúc cả khóa học dài? Hãy thử các Micro Unit - những chủ đề nhỏ được tách ra từ khóa học chính, giúp bạn học tập linh hoạt và hiệu quả hơn.',
    description: 'Introduction description for micro units feature',
  },
  introBenefit1Title: {
    id: 'microUnitPage.introBenefit1Title',
    defaultMessage: 'Học linh hoạt',
    description: 'First benefit title',
  },
  introBenefit1Description: {
    id: 'microUnitPage.introBenefit1Description',
    defaultMessage: 'Chọn chủ đề bạn quan tâm, học theo tốc độ của riêng bạn',
    description: 'First benefit description',
  },
  introBenefit2Title: {
    id: 'microUnitPage.introBenefit2Title',
    defaultMessage: 'Tiết kiệm thời gian',
    description: 'Second benefit title',
  },
  introBenefit2Description: {
    id: 'microUnitPage.introBenefit2Description',
    defaultMessage: 'Mỗi Micro Unit chỉ mất từ 15-45 phút để hoàn thành',
    description: 'Second benefit description',
  },
  introBenefit3Title: {
    id: 'microUnitPage.introBenefit3Title',
    defaultMessage: 'Dễ theo dõi tiến độ',
    description: 'Third benefit title',
  },
  introBenefit3Description: {
    id: 'microUnitPage.introBenefit3Description',
    defaultMessage: 'Xem rõ bạn đã học được bao nhiêu trong mỗi chủ đề',
    description: 'Third benefit description',
  },
  // Progress bar messages
  progressLabel: {
    id: 'microUnitPage.progressLabel',
    defaultMessage: 'Tiến độ',
    description: 'Progress label',
  },
  progressCompleted: {
    id: 'microUnitPage.progressCompleted',
    defaultMessage: '{completed} / {total} hoàn thành',
    description: 'Progress completed text',
  },
  progressPercentage: {
    id: 'microUnitPage.progressPercentage',
    defaultMessage: '{percentage}% hoàn thành',
    description: 'Progress percentage text',
  },
});

export default messages;
