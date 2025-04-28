import { useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';

import { FirebaseContext } from '../../firebaseProvider';
import User from './objects/user';

function PrivateRoute({ children }) {
  const location = useLocation();
  const { currentUser, authIsReady } = useContext(FirebaseContext);

  if (!authIsReady) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    // Save the current location in localStorage so that after login we can redirect back
    localStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/login" replace />;
  }

  // User is authenticated; render the protected content
  return children;
}

function ContactInfoRequiredRoute({ children }) {
  const { currentUser } = useContext(FirebaseContext);
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [existingUser, setExistingUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (currentUser && currentUser.uid) {
        const user = await User.getByUserId(currentUser.uid);
        setExistingUser(user);
      }
      setLoading(false);
    };

    fetchUser();
  }, [currentUser]);

  if (loading) {
    // Optionally, show a loading indicator
    return <div>Loading...</div>;
  }

  if (existingUser && existingUser.nameSurname && existingUser.phoneNumber) {
    return children;
  } else {
    localStorage.setItem('redirectAfterInfoUpdate', location.pathname);
    return <Navigate to="/dodaj-informacje-kontaktowe" replace />;
  }
}

const Redirect = {
  PrivateRoute: PrivateRoute,
  ContactInfoRequiredRoute: ContactInfoRequiredRoute,
}

export default Redirect;