import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>Admin Dashboard</Typography>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6">Platform Statistics</Typography>
        <Typography color="text.secondary">Overview of all users, active projects, and total platform volume.</Typography>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
