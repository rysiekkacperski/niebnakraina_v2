import { Outlet, ScrollRestoration, useLocation } from "react-router";

import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

import AlertManager from "./components/general/alert";
import Navigation from "./components/niebnakraina/components/navigation";

const theme = createTheme({
  palette: {
    primary: {
      light: '#2da3e1',
      main: '#2283bf',
      dark: '#175389',
      gradientRightToTop: "linear-gradient(to left bottom, #2283bf, #307bc0, #4171be, #5467ba, #665bb3, #7655ae, #834ea7, #90469f, #9d459a, #a84494, #b1458e, #ba4688)",
      gradientToRight: "linear-gradient(to right, #2283bf, #307bc0, #4171be, #5467ba, #665bb3, #7655ae, #834ea7, #90469f, #9d459a, #a84494, #b1458e, #ba4688)",
      contrastText: '#fff',
    },
    secondary: {
      light: '#00c680',
      main: '#00a366',
      dark: '#007040',
      contrastText: '#fff',
    },
    purple: {
      light: '#8e63b2',
      main: '#7c48a5',
      dark: '#693a95',
      contrastText: '#fff',
    },
    burgundy: {
      light: '#e44e99',
      main: '#ba4688',
      dark: '#7b3b6d',
      contrastText: '#fff',
    },
  },
  background: {
    default: grey[100],
  }
});

function BasicLayout({ children }){

  return(
    <>
      <ScrollRestoration />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <AlertManager.Alerts />
      </ThemeProvider>
    </>
  );

}

function MainLayout(){

  const location = useLocation();

  return(
    <>
      <BasicLayout>
        <Navigation />
        <Fade in={true} timeout={500} key={location.key}>
          <Box>
            <Outlet />
          </Box>
        </Fade>
      </BasicLayout>
    </>
  );

}

const Layout = {
  Main: MainLayout,

}

export default Layout;


