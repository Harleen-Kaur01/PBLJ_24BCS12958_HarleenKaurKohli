import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Grid, Avatar, Rating, Divider, CircularProgress } from '@mui/material';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';

const FreelancerProfile = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewService.getMyReviews();
        setReviews(data);
      } catch (error) {
        console.error("Failed to load reviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
        <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '3rem' }}>
          {user?.username.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold">{user?.username}</Typography>
          <Typography color="text.secondary" variant="h6" gutterBottom>{user?.role}</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Rating value={averageRating} readOnly precision={0.5} />
            <Typography variant="body1" fontWeight="bold">
              {averageRating.toFixed(1)} ({reviews.length} reviews)
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Typography variant="h5" fontWeight="bold" mb={3}>Client Feedback & Reviews</Typography>
      
      {reviews.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography color="text.secondary">No reviews received yet.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {reviews.map((review) => (
            <Grid item xs={12} key={review.id}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography fontWeight="bold">{review.projectTitle}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reviewed by {review.reviewerUsername} on {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  "{review.comment}"
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FreelancerProfile;
