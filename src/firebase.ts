import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, onIdTokenChanged } from 'firebase/auth'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}
console.log("[FlexOAuth] firebaseConfig loaded:", firebaseConfig);

const firebaseApp = initializeApp(firebaseConfig)
console.log("[FlexOAuth] Firebase app initialized:", firebaseApp);
const auth = getAuth(firebaseApp)
console.log("[FlexOAuth] Auth instance created:", auth);
const provider = new GoogleAuthProvider()
console.log("[FlexOAuth] GoogleAuthProvider instance created:", provider);

onAuthStateChanged(auth, (user) => {
    console.log("[FlexOAuth] onAuthStateChanged event:", user);
});

onIdTokenChanged(auth, (user) => {
    console.log("[FlexOAuth] onIdTokenChanged event:", user);
});

export { auth, provider }