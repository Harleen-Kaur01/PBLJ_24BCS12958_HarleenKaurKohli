import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Container, Alert, MenuItem } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'FREELANCER' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(formData);
      if (user.role === 'CLIENT') navigate('/dashboard/client');
      else if (user.role === 'FREELANCER') navigate('/dashboard/freelancer');
      else navigate('/');
    } catch (err) {
      if (err.message === 'Network Error') {
         setError('Network error');
      } else {
         setError(err.response?.data?.username || 'Registration failed. Please check your details.');
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
          <Typography component="h1" variant="h5" fontWeight="bold" textAlign="center" mb={3}>
            Create an Account
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              select
              required
              fullWidth
              name="role"
              label="I want to..."
              value={formData.role}
              onChange={handleChange}
            >
              <MenuItem value="FREELANCER">Work as a Freelancer</MenuItem>
              <MenuItem value="CLIENT">Hire for a Project</MenuItem>
            </TextField>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }}>
              Sign Up
            </Button>
            <Typography align="center" variant="body2">
              Already have an account? <Link to="/login" style={{ color: '#4F46E5', textDecoration: 'none' }}>Sign In</Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
