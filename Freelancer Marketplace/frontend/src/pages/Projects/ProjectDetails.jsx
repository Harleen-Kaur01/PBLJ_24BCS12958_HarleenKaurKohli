import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Button, Container, CircularProgress, TextField, Alert } from '@mui/material';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Bid State
  const [bidAmount, setBidAmount] = useState('');
  const [bidProposal, setBidProposal] = useState('');
  const [bidSuccess, setBidSuccess] = useState(false);
  const [bidError, setBidError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectService.getProjectById(id);
        setProject(data);
      } catch (error) {
        console.error("Error fetching project", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      await projectService.submitBid(id, { amount: parseFloat(bidAmount), proposal: bidProposal });
      setBidSuccess(true);
      setBidError('');
      setBidAmount('');
      setBidProposal('');
    } catch (error) {
      setBidError(error.response?.data || 'Failed to submit bid.');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!project) return <Typography variant="h5" textAlign="center" mt={10}>Project not found</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>{project.title}</Typography>
            <Typography variant="h5" color="primary.main" fontWeight="bold" mb={3}>
              Budget: ${project.budget.toFixed(2)}
            </Typography>
            
            <Typography variant="h6" fontWeight="bold" mb={1}>Description</Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
              {project.description}
            </Typography>

            <Typography variant="body2" color="text.secondary" mt={4}>
              Posted by: <strong>{project.clientName}</strong> on {new Date(project.createdAt).toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: 'background.default' }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>Submit a Proposal</Typography>
            
            {user?.role === 'CLIENT' ? (
              <Alert severity="info">Clients cannot bid on projects.</Alert>
            ) : project.status !== 'OPEN' ? (
              <Alert severity="warning">This project is no longer accepting bids.</Alert>
            ) : (
              <Box component="form" onSubmit={handleBidSubmit}>
                {bidSuccess && <Alert severity="success" sx={{ mb: 2 }}>Bid submitted successfully!</Alert>}
                {bidError && <Alert severity="error" sx={{ mb: 2 }}>{bidError}</Alert>}
                
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Bid Amount ($)"
                  margin="normal"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  inputProps={{ step: "0.01", min: "1" }}
                />
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="Cover Letter / Proposal"
                  margin="normal"
                  value={bidProposal}
                  onChange={(e) => setBidProposal(e.target.value)}
                />
                <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 2 }}>
                  Submit Bid
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProjectDetails;
