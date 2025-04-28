import { use, useEffect } from "react";
import { useNavigate } from "react-router";

import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    GoogleAuthProvider, 
    FacebookAuthProvider, 
    signInWithRedirect,
    getRedirectResult,
    setPersistence,
    browserSessionPersistence
} from "firebase/auth";

import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

import CustomButton from "./buttons";
import CustomForm from './form'
import AlertManager from "./alert";
import validation from "../form/schema";
import Input from "../form/input";
import Text from "./text";
import Section from "./section";
import CustomCard from "./card";
import User from "../functionality/objects/user";
import { FirebaseContext } from "../../firebaseProvider";

let successfulLoginAlert = {
  'severity': 'success',
  'autoClose': true,
  'message': 'Zalogowano pomyślnie'
}

let successfulSignUpAlert = {
  'severity': 'success',
  'autoClose': true,
  'message': 'Pomyślnie utworzono konto i zalogowano'
}

let unSuccessfulLoginAlert = {
  'severity': 'error',
  'autoClose': true,
  'message': 'Logowanie nie powiodło się. Spróbuj ponownie'
}

const AuthPage = ({ children }) => {

  const navigate = useNavigate();
  const redirect = localStorage.getItem('redirectAfterLogin') || '/';
  const auth = use(FirebaseContext).auth
  const { setAlert } = use(AlertManager.Context)

  useEffect(() => {

    const setupAuth = async () => {
      try {
        await setPersistence(auth, browserSessionPersistence);
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log(result.user)
          // Removing redirection item if exists
          if(localStorage.getItem('redirectAfterLogin'))
            localStorage.removeItem('redirectAfterLogin');
          // Adding a new helper item for user data which is not stored by FbAuth automatically
          const existingUser = await User.getByUserId(result.user.uid);
          if (!existingUser) {
            const newUser = new User(result.user.uid, result.user.phoneNumber);
            await newUser.addFromAuth();
          }
          // Setting an alert for successful login
          setAlert(successfulLoginAlert.severity, successfulLoginAlert.message);
          // Navigate further
          navigate(redirect, { replace: true });
        }
      } catch (error) {
        setAlert('error', 'Błąd. Sprawdź połączenie internetowe');
      }
    };
  
    setupAuth();

  }, [auth, navigate, redirect, setAlert])

  return(
    <Section full first>
      <CustomCard.Form
        image='/img/sign_in.webp'
        title='Zidentyfikuj się, aby kontynuować'
        label='LOGOWANIE'
        color='primary'
        sx={{ 
          display: 'flex', 
          justifyContent: 'center' 
        }}
      >
        <Stack 
          spacing={2}
          sx={{ 
            display: 'flex', 
            width: '100%',
            paddingY: { sm:2, lg:0 } 
          }}
        >
          <SocialAuthForm auth={auth}/>
          <Divider>LUB</Divider>
          <AuthForm redirectUri={redirect} auth={auth} />
        </Stack>
      </CustomCard.Form>
    </Section>
  );

}

function SocialAuthForm({auth, ...props}){

    const googleProvider = new GoogleAuthProvider();
    const facebookProvider = new FacebookAuthProvider();

    let login = (provider) => {
      signInWithRedirect(auth, provider)
    }

    let googleLogin = () => {
      login(googleProvider);
    }    

    let facebookLogin = () => {
      login(facebookProvider);
    };

    return( 
      <Stack 
        spacing={2} 
        sx={{ 
          width: {sm: '75%', md: '50%', lg: '100%'}, 
          display: 'flex',
        }} 
        {...props}
      >
        <CustomButton.GoogleAuth size='large' onClick={googleLogin} />
        <CustomButton.FacebbokAuth size='large' onClick={facebookLogin} />
        <CustomButton.AppleAuth size='large' />
        <CustomButton.MicrosoftAuth size='large' />
      </Stack>
    );

}

function AuthForm({auth, register, redirectUri, ...props}){

    const navigate = useNavigate();
    const { setAlert } = use(AlertManager.Context)

    const schema = {
      email: validation.email(),
      password: validation.password(),
    }

    const initials = {
      email: '',
      password: '',
    }

    const loginFunction = (values, resetForm) =>     
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then((result) => {
            resetForm();
            setAlert(successfulLoginAlert.severity, successfulLoginAlert.message);
            localStorage.removeItem('redirectAfterLogin');
            navigate(redirectUri, { replace: true });
          }
        )
        .catch((error) => {
          if (error.code === 'auth/user-not-found') {
            createUserWithEmailAndPassword(auth, values.email, values.password)
              .then(async (result) => {
                  resetForm();
                  
                  setAlert(successfulSignUpAlert.severity, successfulLoginAlert.message);
                  
                  const newUser = new User(result.user.uid, result.user.phoneNumber);
                  await newUser.addFromAuth();
                  
                  localStorage.removeItem('redirectAfterLogin');
                  navigate(redirectUri, { replace: true });
                }
              )
              .catch(() => {
                setAlert(unSuccessfulLoginAlert.severity, unSuccessfulLoginAlert.message)
              })
          } else {
            setAlert(unSuccessfulLoginAlert.severity, unSuccessfulLoginAlert.message)
          }
        }
      )
        
    return(
      <CustomForm
        initialValues={initials}
        validationObject={schema}
        onSubmitFunc={loginFunction}
        sx={{ width: {sm: '75%', md: '50%', lg: '100%'}, display: 'flex' }}
      >
        {
          (formik) =>
            <Stack spacing={2}>
              <Input.Email formik={formik} />
              <Input.Password formik={formik} />
              <CustomButton.Button type='submit' size='large'>Kontynuj</CustomButton.Button>
              <Text.Small>Nie masz konta? Wpisz powyżej dane, których chcesz używać podczas logowania. Konto zostanie utworzone automatycznie.</Text.Small>
            </Stack>    
        }
      </CustomForm>
    );


}

export default AuthPage;