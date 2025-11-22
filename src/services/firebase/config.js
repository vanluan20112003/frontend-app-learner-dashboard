// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyARpG2EXi2zwvdrINoTMPPTz0i2VSmmHpI',
  authDomain: 'open-edx-14c95.firebaseapp.com',
  databaseURL: 'https://open-edx-14c95-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'open-edx-14c95',
  storageBucket: 'open-edx-14c95.firebasestorage.app',
  messagingSenderId: '457767110705',
  appId: '1:457767110705:web:53e78c9da9ad5740156d10',
  measurementId: 'G-GWQF2WCXPJ',
};

// Database environment constants
export const DATABASE_ENVIRONMENTS = {
  PRODUCTION: 'generalChat', // Production database path
  DEV: 'generalChatDev', // Development database path
};

// Initialize Firebase lazily
let app = null;
let database = null;
let initPromise = null;

// Current database environment (default to production)
let currentDbEnvironment = DATABASE_ENVIRONMENTS.PRODUCTION;

// Load saved database environment preference (dev mode only)
if (process.env.NODE_ENV === 'development') {
  const savedEnv = localStorage.getItem('firebase_db_environment');
  if (savedEnv && Object.values(DATABASE_ENVIRONMENTS).includes(savedEnv)) {
    currentDbEnvironment = savedEnv;
  }
}

const initializeFirebase = async () => {
  if (app && database) {
    return { app, database };
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      const { initializeApp } = await import('firebase/app');
      const { getDatabase } = await import('firebase/database');

      app = initializeApp(firebaseConfig);
      database = getDatabase(app);
      console.log('Firebase initialized successfully');
      console.log(`Using database environment: ${currentDbEnvironment}`);
      return { app, database };
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      app = null;
      database = null;
      return { app: null, database: null };
    }
  })();

  return initPromise;
};

// Export a function to get the database
export const getFirebaseDatabase = async () => {
  await initializeFirebase();
  return database;
};

// Get current database path (root path for all chat data)
export const getDatabasePath = () => currentDbEnvironment;

/**
 * Get full database path including room
 * @param {string} roomId - Room ID (from chatRooms.js)
 * @returns {string} Full path like 'generalChat' (for GENERAL room) or 'generalChat/hoidap'
 *
 * Note: GENERAL room (roomId = '') uses the legacy path without room segment
 * to maintain backward compatibility with existing chat data
 */
export const getFullDatabasePath = (roomId) => {
  // If roomId is empty (GENERAL room), return just the database environment
  // This maintains backward compatibility with existing chat data
  if (!roomId) {
    return currentDbEnvironment;
  }
  return `${currentDbEnvironment}/${roomId}`;
};

// Set database environment (dev mode only)
export const setDatabaseEnvironment = (environment) => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Database environment switching is only available in development mode');
    return false;
  }

  if (!Object.values(DATABASE_ENVIRONMENTS).includes(environment)) {
    console.error(`Invalid database environment: ${environment}`);
    return false;
  }

  currentDbEnvironment = environment;
  localStorage.setItem('firebase_db_environment', environment);
  console.log(`Switched to database environment: ${environment}`);
  return true;
};

// Get current database environment
export const getCurrentDatabaseEnvironment = () => currentDbEnvironment;

// Check if in development mode
export const isDevMode = () => process.env.NODE_ENV === 'development';

export { app, database, initializeFirebase };
