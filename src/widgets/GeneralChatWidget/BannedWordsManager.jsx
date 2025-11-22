import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button,
  Icon,
  IconButton,
  Alert,
  Card,
  Form,
  Badge,
  Spinner,
} from '@openedx/paragon';
import {
  Add,
  Delete,
  ExpandLess,
  ExpandMore,
  Warning,
} from '@openedx/paragon/icons';
import {
  addBannedWord,
  removeBannedWord,
  subscribeToBannedWords,
} from 'services/firebase/chatService';
import messages from './messages';

const BannedWordsManager = ({ currentUser }) => {
  const { formatMessage } = useIntl();
  const [isExpanded, setIsExpanded] = useState(false);
  const [bannedWords, setBannedWords] = useState([]);
  const [newWord, setNewWord] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Subscribe to banned words
  useEffect(() => {
    let unsubscribe;

    const setupSubscription = async () => {
      unsubscribe = await subscribeToBannedWords((words) => {
        setBannedWords(words);
      });
    };

    setupSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleAddWord = async (e) => {
    e.preventDefault();
    if (!newWord.trim()) {
      return;
    }

    setIsAdding(true);
    setError(null);
    setSuccess(null);

    const result = await addBannedWord(newWord.trim(), currentUser);

    if (result.success) {
      setNewWord('');
      setSuccess(formatMessage(messages.bannedWordAdded));
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(`Failed to add word: ${result.error}`);
    }

    setIsAdding(false);
  };

  const handleRemoveWord = async (wordId) => {
    const result = await removeBannedWord(wordId, currentUser);

    if (!result.success) {
      setError(`Failed to remove word: ${result.error}`);
    } else {
      setSuccess(formatMessage(messages.bannedWordRemoved));
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  if (!currentUser || (!currentUser.isStaff && !currentUser.isAdmin)) {
    return null;
  }

  return (
    <Card className="banned-words-manager mb-2">
      <Card.Body className="p-2">
        <Button
          variant="outline-warning"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          block
        >
          <Icon src={Warning} className="mr-2" />
          {formatMessage(messages.bannedWords)} ({bannedWords.length})
          <Icon src={isExpanded ? ExpandLess : ExpandMore} className="ml-2" />
        </Button>

        {isExpanded && (
          <div className="mt-2">
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-2">
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success" dismissible onClose={() => setSuccess(null)} className="mb-2">
                {success}
              </Alert>
            )}

            <Form onSubmit={handleAddWord} className="mb-2">
              <Form.Group className="mb-2">
                <Form.Label className="small font-weight-bold">
                  {formatMessage(messages.addBannedWord)}
                </Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder={formatMessage(messages.enterWordOrPhrase)}
                    size="sm"
                    disabled={isAdding}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="ml-2"
                    disabled={!newWord.trim() || isAdding}
                    iconBefore={isAdding ? Spinner : Add}
                  >
                    {formatMessage(messages.add)}
                  </Button>
                </div>
              </Form.Group>
            </Form>

            <div className="banned-words-list">
              <div className="small font-weight-bold mb-2">
                {formatMessage(messages.currentBannedWords)}:
              </div>
              {bannedWords.length === 0 ? (
                <div className="text-center text-muted p-2">
                  <small>{formatMessage(messages.noBannedWords)}</small>
                </div>
              ) : (
                <div className="banned-words-grid">
                  {bannedWords.map((word) => (
                    <div key={word.id} className="banned-word-tag">
                      <span className="banned-word-text">{word.word}</span>
                      <button
                        type="button"
                        className="banned-word-remove"
                        onClick={() => handleRemoveWord(word.id)}
                        aria-label={formatMessage(messages.removeWord)}
                      >
                        <Icon src={Delete} style={{ fontSize: '0.875rem' }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-2">
              <Alert variant="info" className="mb-0">
                <small>
                  <Icon src={Warning} className="mr-1" />
                  {formatMessage(messages.bannedWordsInfo)}
                </small>
              </Alert>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

BannedWordsManager.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
    name: PropTypes.string,
    isStaff: PropTypes.bool,
    isAdmin: PropTypes.bool,
  }),
};

BannedWordsManager.defaultProps = {
  currentUser: null,
};

export default BannedWordsManager;
