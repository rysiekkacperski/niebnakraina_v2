import { createContext, useState, useEffect, useContext, use } from "react";

import Alert from '@mui/material/Alert'
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import { FirebaseContext } from "../../firebaseProvider";

const AlertContext = createContext();

const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  function setAlert(severity, message, autoClose=true){
    setAlerts((exsistingAlerts) => [...exsistingAlerts, {
      'severity': severity,
      'message': message,
      'autoClose': autoClose
    }]);
  }
  

  let value = {
    'alerts': alerts,
    'setAlert': setAlert,
  }

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
}

const ClosingAlert = ({alert}) => {

  const [open, setOpen] = React.useState(true);

  return(
    <Alert 
      severity={alert.severity} 
      variant="filled"
      onClose={() => setOpen(false)}
      sx={{
        borderRadius: 2,
        display: open ? 'flex' : 'none',
      }}
    >
      {alert.message}
    </Alert>
  );
}

const AutoClosingAlert = ({alert}) => {

  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(true)
	
	useEffect(() => {
		if(alert && alert.autoClose){
			const timeout = setTimeout(() => setOpen(false), 2000);
			const interval = setInterval(() => setProgress((progress) => progress + 2.1), 20);
			return () => {
					clearTimeout(timeout);
					clearInterval(interval);
			}
		}
	}, [])

  return(
    <Box
      sx={{
        borderRadius: 2,
        width: '100%',
        display: open ? 'block' : 'none',
      }}
    >
      <Alert 
        severity={alert.severity} 
        variant="filled"
        sx={{
          borderRadius: 0,
          width: '100%',
        }}
      >
        {alert.message}
      </Alert>
      <LinearProgress 
        variant="determinate"
        color={alert?.severity} 
        value={progress}
        sx={{
          borderRadius: 0,
          width: '100%',
        }}
      />
    </Box>
    
  );

}

const CustomAlert = ({alert}) => {
  return(
    <>
      {
        alert.autoClose ? 
          <AutoClosingAlert 
            alert={alert} 
          /> 
        : 
          <ClosingAlert 
              alert={alert} 
          />
      }
    </>
  );
}

const AlertsStack = ({alerts}) => {

  return(
    <Container 
      maxWidth='sm'
      sx={{
        position:"fixed",
        bottom: 5,
        right: 5,
      }}
    >
      <Stack
        spacing={1.5}
        useFlexGap
      > 
        {
          alerts?  
            alerts.map((alert, key) => <CustomAlert alert={alert} key={key} />)
          : <></>
        }
      </Stack>
    </Container>  
  )
}

const Alerts = () => {
  let alerts = useContext(AlertContext);
  return(
    <AlertsStack alerts={alerts.alerts} />
  );
}

const AlertManager = {
  'Provider': AlertProvider,
  'Alerts': Alerts,
  'Context': AlertContext,
  'setAlert': (severity, message, autoClose=true) => 
    use(FirebaseContext).setAlert(severity, message, autoClose)
}

export default AlertManager;