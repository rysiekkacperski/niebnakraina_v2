import { createContext, useEffect, useState } from 'react';
import { 
    getAuth,
    onAuthStateChanged, 
    connectAuthEmulator 
} from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

import User from './components/functionality/objects/user';
import Patient from './components/functionality/objects/patient';
import Category from './components/functionality/objects/category';
import Product from './components/functionality/objects/product';
import VisitMode from './components/functionality/objects/visitMode';
import DateSlot from './components/functionality/objects/dateSlot';
import Therapist from './components/functionality/objects/therapist';

// Create the Firebase Context
export const FirebaseContext = createContext();

// Firebase Provider Component
export const FirebaseProvider = ({ children, firebaseApp }) => {
  
  // Initialize Firebase
  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const functions = getFunctions(firebaseApp);
  const storage = getStorage(firebaseApp);
  const [currentUser, setCurrentUser] = useState(null);
  const [emulatorsReady, setEmulatorsReady] = useState(false); // Track emulator setup
  const [authIsReady, setAuthIsReady] = useState(false);

  if (process.env.NODE_ENV === 'development') {
    console.log('Running in development mode');
  }

  if (process.env.NODE_ENV !== 'development'){
    initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaEnterpriseProvider('6LdC5tsqAAAAAFfDph4KWiAtjPTyqbY1bJ4ezjs_'),
      isTokenAutoRefreshEnabled: true // Set to true to allow auto-refresh.
    });
  }

  // Set up emulators

  useEffect(() => {
    const setupEmulators = async () => {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        connectStorageEmulator(storage, '127.0.0.1', 9199);
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
        connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
        connectFunctionsEmulator(functions, '127.0.0.1', 5001);
      }
      setEmulatorsReady(true); // Mark as ready after all connections
    };

    setupEmulators();
  }, [auth, firestore, functions, storage]);

  useEffect(() => {
    if (!emulatorsReady) {
      console.log('Emulators are not ready!')
      return
    } // Wait until emulators are ready

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthIsReady(true);
      console.log("Auth ready:", authIsReady, "Current user:", currentUser);
    });

    return () => unsubscribe();
  }, [auth, emulatorsReady]);

  const value = {
    firestore,
    auth,
    functions,
    storage,
    currentUser,
    authIsReady,
  };

  //Set up context for classes
  User.setContext(value);
  Patient.setContext(value);
  Category.setContext(value);
  Product.setContext(value);
  VisitMode.setContext(value);
  Therapist.setContext(value);
  DateSlot.setContext(value);

  return (
    <FirebaseContext.Provider 
      value={value}
    >
      {children}
    </FirebaseContext.Provider>
  );
};