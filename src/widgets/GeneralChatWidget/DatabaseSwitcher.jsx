import React, { useState } from 'react';
import {
  Card, Button, Alert, Icon,
} from '@openedx/paragon';
import {
  Storage, Refresh, CheckCircle, Warning,
} from '@openedx/paragon/icons';
import {
  DATABASE_ENVIRONMENTS,
  getCurrentDatabaseEnvironment,
  setDatabaseEnvironment,
  isDevMode,
} from 'services/firebase/config';

/**
 * DatabaseSwitcher - Dev-only component to switch between production and dev databases
 * Only visible in development mode
 */
const DatabaseSwitcher = () => {
  const [currentEnv, setCurrentEnv] = useState(getCurrentDatabaseEnvironment());
  const [showWarning, setShowWarning] = useState(false);

  // Only render in development mode
  if (!isDevMode()) {
    return null;
  }

  const handleSwitch = (environment) => {
    if (environment === currentEnv) {
      return;
    }

    setShowWarning(true);

    // Show warning for 2 seconds before switching
    setTimeout(() => {
      const success = setDatabaseEnvironment(environment);
      if (success) {
        setCurrentEnv(environment);
        // Reload page to reconnect to new database
        window.location.reload();
      }
    }, 1500);
  };

  const getEnvironmentLabel = (env) => {
    switch (env) {
      case DATABASE_ENVIRONMENTS.PRODUCTION:
        return 'Production (Real Chat)';
      case DATABASE_ENVIRONMENTS.DEV:
        return 'Development (Test Chat)';
      default:
        return env;
    }
  };

  const getEnvironmentDescription = (env) => {
    switch (env) {
      case DATABASE_ENVIRONMENTS.PRODUCTION:
        return 'Connected to production chat database with real user messages';
      case DATABASE_ENVIRONMENTS.DEV:
        return 'Connected to development chat database for testing';
      default:
        return '';
    }
  };

  return (
    <Card className="database-switcher-card mb-2">
      <Card.Body className="p-3">
        <div className="d-flex align-items-center mb-2">
          <Icon src={Storage} className="mr-2" style={{ fontSize: '1.25rem' }} />
          <span className="font-weight-bold">Database Environment</span>
          <span className="ml-auto badge badge-warning">DEV MODE</span>
        </div>

        <div className="current-environment mb-3">
          <div className="d-flex align-items-center">
            <Icon src={CheckCircle} className="mr-2 text-success" />
            <div>
              <div className="font-weight-bold">{getEnvironmentLabel(currentEnv)}</div>
              <small className="text-muted">{getEnvironmentDescription(currentEnv)}</small>
            </div>
          </div>
        </div>

        {showWarning && (
          <Alert variant="warning" className="mb-2">
            <Icon src={Warning} className="mr-2" />
            Switching database... Page will reload.
          </Alert>
        )}

        <div className="environment-buttons">
          <div className="btn-group w-100" role="group">
            <Button
              variant={currentEnv === DATABASE_ENVIRONMENTS.PRODUCTION ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => handleSwitch(DATABASE_ENVIRONMENTS.PRODUCTION)}
              disabled={currentEnv === DATABASE_ENVIRONMENTS.PRODUCTION || showWarning}
              className="flex-fill"
            >
              <Icon src={Storage} className="mr-1" style={{ fontSize: '0.875rem' }} />
              Production
            </Button>
            <Button
              variant={currentEnv === DATABASE_ENVIRONMENTS.DEV ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => handleSwitch(DATABASE_ENVIRONMENTS.DEV)}
              disabled={currentEnv === DATABASE_ENVIRONMENTS.DEV || showWarning}
              className="flex-fill"
            >
              <Icon src={Refresh} className="mr-1" style={{ fontSize: '0.875rem' }} />
              Development
            </Button>
          </div>
        </div>

        <div className="mt-2">
          <small className="text-muted">
            <strong>Note:</strong> This switcher is only available in development mode.
            Production builds will always use the production database.
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DatabaseSwitcher;
