import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, Box, Button, Badge, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link } from 'react-router-dom';
import { useStore } from '@nanostores/react';
import { authStore, logout } from '../stores/authStore';

const Navbar = ({ toggleTheme, isDarkMode }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { isAuthenticated, user } = useStore(authStore)

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleLogout = () => {
        logout()
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton>
                            <Badge color="error" variant="dot">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                    {isAuthenticated ? (
                        <Box>
                            <Button component={Link} to="/dashboard">Dashboard</Button>
                            <Button component={Link} to="/transactions">Transactions</Button>
                            <Button component={Link} to="/settings">Settings</Button>
                            <Button onClick={handleLogout}>Logout</Button>
                        </Box>
                    ) : (
                        <Box>
                            <Button component={Link} to="/login">Login</Button>
                            <Button component={Link} to="/register">Register</Button>
                        </Box>
                    )}
                </Box>
            </Drawer>
        </>
    );
};

export default Navbar;