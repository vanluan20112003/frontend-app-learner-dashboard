/**
 * Firebase Connection Test Script
 * Run this in browser console to test Firebase connection
 */

export const testFirebaseConnection = async () => {
  console.log('🔍 Testing Firebase Connection...\n');

  try {
    // Step 1: Test Firebase initialization
    console.log('Step 1: Initializing Firebase...');
    const { getFirebaseDatabase } = await import('./config');
    const database = await getFirebaseDatabase();

    if (!database) {
      console.error('❌ Firebase database is null');
      return {
        success: false,
        error: 'Firebase not initialized',
      };
    }
    console.log('✅ Firebase initialized successfully');

    // Step 2: Test database reference
    console.log('\nStep 2: Creating database reference...');
    const { ref } = await import('firebase/database');
    const testRef = ref(database, 'generalChat/messages');
    console.log('✅ Database reference created');

    // Step 3: Test write permission
    console.log('\nStep 3: Testing write permission...');
    const { push, serverTimestamp } = await import('firebase/database');

    const testMessage = {
      text: 'Connection test message',
      userName: 'Test User',
      userId: 'test_user',
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
    };

    await push(testRef, testMessage);
    console.log('✅ Write test successful');

    // Step 4: Test read permission
    console.log('\nStep 4: Testing read permission...');
    const { get } = await import('firebase/database');
    const snapshot = await get(testRef);
    console.log('✅ Read test successful');
    console.log('📊 Messages count:', snapshot.size);

    console.log('\n✅ All tests passed! Firebase is working correctly.');
    return {
      success: true,
      messagesCount: snapshot.size,
    };
  } catch (error) {
    console.error('\n❌ Firebase test failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', error);

    // Provide helpful error messages
    if (error.code === 'PERMISSION_DENIED') {
      console.error('\n🔧 Solution: Firebase Database Rules need to be configured.');
      console.error('Go to Firebase Console → Realtime Database → Rules');
      console.error('See FIREBASE_CHAT_SETUP.md for instructions');
    }

    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
};

// Make it available globally for easy testing
if (typeof window !== 'undefined') {
  window.testFirebaseConnection = testFirebaseConnection;
  console.log('💡 Firebase test function loaded. Run: window.testFirebaseConnection()');
}
