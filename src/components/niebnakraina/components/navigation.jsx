import { useState } from "react";

import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from '@mui/icons-material/Close';
import { useTheme, useMediaQuery } from "@mui/material";

import NiebnaButtons from "./buttons";
import Nav from "../../general/nav";
import Utilities from "./utilities";

const navItems = [
  { label: 'Strona główna', path: '/' },
  { label: 'O nas', path: '/o-nas' },
];

const Navigation = (sx) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  const ClientActions = () => {
    return (
      <Stack spacing={1} direction={isLargeScreen ? "row" : "column"}>
        <NiebnaButtons.Visit to='/wizyta' pill />
        <NiebnaButtons.Contact color='purple' pill />
      </Stack>
    );
  };

  return (
    <Nav.Bar>
      <Toolbar
        sx={{
          background: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(40px)",
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
          py: 3,
        }}
      >
        {isLargeScreen ? (
          <>
            {/* Left Section: Logo and NavLinks */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between' 
            }}>
              <Utilities.LogoLink />
              {/* Give the NavLinks some left margin so they’re not flush against the logo */}
              <Box sx={{ ml: 5 }}>
                <Nav.Links navItems={navItems} />
              </Box>
              <ClientActions />
            </Box>
          </>
        ) : (
          <>
            {/* Mobile: Logo on the left */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center' 
            }}>
              <Utilities.LogoLink />
            </Box>
            {/* Mobile: Menu button on the right */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              justifyContent: 'flex-end' 
            }}>
              <IconButton onClick={toggleDrawer(true)} color="secondary">
                <MenuIcon />
              </IconButton>
            </Box>
          </>
        )}
      </Toolbar>

      {/* Mobile Drawer */}
      {!isLargeScreen && (
        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
          <Box
            sx={{
              padding: 2,
              marginTop: 2,
              width: '100%',
              justifyContent: 'space-between',
              alignItems: "center",
              display: 'flex',
            }}
          >
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center',
              height: 'fit-content' 
            }}>
              <Utilities.LogoLink />
            </Box>
            <IconButton onClick={toggleDrawer(false)} color="secondary">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box 
            sx={{
              padding: 2, 
              display: "flex", 
              flexDirection: 'column', 
              gap: 2
            }} 
            role="presentation" 
            onClick={toggleDrawer(false)}
          >
            <Nav.Links navItems={navItems} />
            <ClientActions />
          </Box>
        </Drawer>
      )}
    </Nav.Bar>
  );
};

export default Navigation;