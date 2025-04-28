import { NavLink } from 'react-router';

import AppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useTheme, useMediaQuery } from "@mui/material";

const NavBar = (props) => {
  return(
    <AppBar 
      position="fixed" 
      color='inherit' 
      sx={{
        boxShadow: 0.5,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: !!props.mt ? 'calc(var(--template-frame-height, 0px) + 28px)' : 0,
        ...props.sx
      }}
    >
      {props.children}
    </AppBar>
  );
}

const NavLinks = ({navItems}) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <List
      sx={{
        display: 'flex',
        flexDirection: isLargeScreen ? 'row' : 'column',
        padding: 0,
        gap: 1.5,
      }}
    >
      {navItems.map(item => (
        <ListItem 
          key={item.path} 
          disablePadding 
          sx={{ width: isLargeScreen ? 'auto' : '100%' }}
        >
          <ListItemButton
            component={NavLink}
            to={item.path}
            sx={{
              display: 'flex',
              alignItems: 'center',  // Ensures vertical alignment
              justifyContent: 'center',  // Ensures horizontal centering
              height: 'auto',  // Avoids unnecessary height
              minHeight: 'unset', // Prevents Material-UI default minHeight
              width: '100%',
              color: theme.palette.grey[800],
              textDecoration: 'none',
              px: 1.5,
              py: 0.2,
              borderRadius: 1,
              backgroundColor: 'transparent',
              
              height: 'fit-content',
              transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.3s ease',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                transform: 'scale(1.05)',
              },
              '&.active': {
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.action.selected,
                fontWeight: 'bold',
              },
            }}
          >
            <ListItemText 
              primary={item.label} 
              sx={{ whiteSpace: 'nowrap'}} 
              
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

const Nav = {
  Bar: NavBar,
  Links: NavLinks
}

export default Nav;
