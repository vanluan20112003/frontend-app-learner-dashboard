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

// Initialize Firebase lazily
let app = null;
let database = null;
let initPromise = null;

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

export { app, database, initializeFirebase };
