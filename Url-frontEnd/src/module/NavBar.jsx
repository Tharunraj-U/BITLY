import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Fingerprint from '@mui/icons-material/Fingerprint';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const NavBar = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const logOut = () => {
    dispatch(logout());
    if (isMobile) setDrawerOpen(false);
  };

  const menuItems = [
    { text: 'Home', to: '/home', icon: <HomeIcon /> },
    { text: 'About', to: '/about', icon: <InfoIcon /> },
  ];

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#1f2937' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Shrinky 👑
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {menuItems.map(({ text, to }) => (
                <Button
                  key={text}
                  component={Link}
                  to={to}
                  color="inherit"
                  variant="outlined"
                  sx={{ borderColor: 'white', color: 'white' }}
                >
                  {text}
                </Button>
              ))}
              <IconButton
                aria-label="logout"
                color="success"
                onClick={logOut}
                size="large"
              >
                <Fingerprint />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        ModalProps={{ keepMounted: true }}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map(({ text, icon, to }) => (
              <ListItem
                button
                component={Link}
                to={to}
                key={text}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
            <ListItem button onClick={logOut} key="logout">
              <ListItemIcon>
                <Fingerprint color="success" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NavBar;
