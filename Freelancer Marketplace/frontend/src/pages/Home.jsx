import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box sx={{ pt: 15, pb: 10, textAlign: 'center' }}>
      <Container maxWidth="lg">
        <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '5rem' }, fontWeight: 800, mb: 3 }}>
          The Modern <Box component="span" sx={{ color: 'primary.main' }}>Freelance</Box> Hub
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 5, maxWidth: '800px', mx: 'auto' }}>
          Connect with top-tier talent or find your next big project. A beautifully crafted platform for modern workers.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
          <Button component={Link} to="/projects" variant="contained" size="large" sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}>
            Find Work
          </Button>
          <Button component={Link} to="/register" variant="outlined" size="large" sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}>
            Hire Talent
          </Button>
        </Box>

        {/* Placeholder for feature grid or stats */}
        <Grid container spacing={4} sx={{ mt: 10 }}>
            <Grid item xs={12} md={4}>
                <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 4, boxShadow: 1 }}>
                    <Typography variant="h4" color="primary.main" fontWeight="bold">10k+</Typography>
                    <Typography color="text.secondary">Active Freelancers</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={4}>
                <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 4, boxShadow: 1 }}>
                    <Typography variant="h4" color="primary.main" fontWeight="bold">$5M+</Typography>
                    <Typography color="text.secondary">Paid to Talent</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} md={4}>
                <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 4, boxShadow: 1 }}>
                    <Typography variant="h4" color="primary.main" fontWeight="bold">99%</Typography>
                    <Typography color="text.secondary">Client Satisfaction</Typography>
                </Box>
            </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
