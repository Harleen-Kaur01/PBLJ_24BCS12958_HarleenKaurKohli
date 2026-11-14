import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import WorkIcon from '@mui/icons-material/Work';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'CLIENT') return '/dashboard/client';
    if (user.role === 'FREELANCER') return '/dashboard/freelancer';
    if (user.role === 'ADMIN') return '/dashboard/admin';
    return '/';
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', color: 'text.primary', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
      <Toolbar>
        <WorkIcon sx={{ color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 800 }}>
          FreelanceHub
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button component={Link} to="/projects" color="inherit">Explore Projects</Button>
          
          {!user ? (
            <>
              <Button component={Link} to="/login" variant="outlined" color="primary">Login</Button>
              <Button component={Link} to="/register" variant="contained" color="primary">Sign Up</Button>
            </>
          ) : (
            <>
              <Button component={Link} to={getDashboardLink()} color="inherit">Dashboard</Button>
              <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{user.username.charAt(0).toUpperCase()}</Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem component={Link} to="/profile" onClick={handleClose}>Profile</MenuItem>
                <MenuItem component={Link} to="/messages" onClick={handleClose}>Messages</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
