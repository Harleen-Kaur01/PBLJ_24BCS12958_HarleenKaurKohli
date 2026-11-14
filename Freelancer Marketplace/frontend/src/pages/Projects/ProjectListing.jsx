import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, Button, Container, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/projectService';

const ProjectListing = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getAllProjects();
        // Only show OPEN projects in the public listing
        setProjects(data.filter(p => p.status === 'OPEN'));
      } catch (error) {
        console.error("Error fetching projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" fontWeight={800} mb={4}>Explore Open Projects</Typography>
      
      {projects.length === 0 ? (
        <Typography variant="h6" color="text.secondary">No open projects found at the moment.</Typography>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {project.title}
                  </Typography>
                  <Typography color="primary.main" variant="h6" fontWeight="bold" mb={2}>
                    ${project.budget.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.description}
                  </Typography>
                  <Chip label={`Client: ${project.clientName}`} size="small" sx={{ mb: 2 }} />
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button component={Link} to={`/projects/${project.id}`} variant="contained" fullWidth>
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProjectListing;
