import React, { useState, useEffect } from 'react';
import { Alert } from '@openedx/paragon';
import { getFirebaseDatabase } from 'services/firebase/chatService';

export const FirebaseDebugInfo = () => {
  const [debugInfo, setDebugInfo] = useState({
    firebaseInitialized: false,
    error: null,
  });

  useEffect(() => {
    const checkFirebase = async () => {
      try {
        const { getFirebaseDatabase: getDb } = await import('services/firebase/config');
        const db = await getDb();

        setDebugInfo({
          firebaseInitialized: !!db,
          databaseUrl: db ? 'Connected' : 'Not connected',
          error: null,
        });
      } catch (error) {
        setDebugInfo({
          firebaseInitialized: false,
          error: error.message,
        });
      }
    };

    checkFirebase();
  }, []);

  if (debugInfo.firebaseInitialized) {
    return null; // Don't show anything if Firebase is working
  }

  return (
    <Alert variant="warning" className="mt-2">
      <Alert.Heading>Firebase Debug Info</Alert.Heading>
      <p>Firebase Initialized: {debugInfo.firebaseInitialized ? 'Yes' : 'No'}</p>
      {debugInfo.error && <p>Error: {debugInfo.error}</p>}
      <hr />
      <p className="mb-0">
        Please check the browser console for more details.
      </p>
    </Alert>
  );
};
