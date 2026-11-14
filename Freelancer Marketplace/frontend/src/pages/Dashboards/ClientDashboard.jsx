import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Container, Grid, Paper, Button, Tabs, Tab, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating
} from '@mui/material';
import { Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import { projectService } from '../../services/projectService';
import { contractService } from '../../services/contractService';
import { paymentService } from '../../services/paymentService';
import { bidService } from '../../services/bidService';
import { reviewService } from '../../services/reviewService';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const ClientDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  
  const [projects, setProjects] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidsByProject, setBidsByProject] = useState({});

  // Review Dialog State
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null); // stores { projectId, freelancerId }
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [projData, contData, payData] = await Promise.all([
        projectService.getMyProjects(),
        contractService.getMyContracts(),
        paymentService.getPaymentHistory()
      ]);
      setProjects(projData);
      setContracts(contData);
      setPayments(payData);

      const bidsMap = {};
      for (const p of projData) {
        if (p.status === 'OPEN') {
          const bids = await bidService.getBidsForProject(p.id);
          bidsMap[p.id] = bids;
        }
      }
      setBidsByProject(bidsMap);
    } catch (error) {
      console.error("Error loading dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBid = async (bidId) => {
    try {
      await bidService.acceptBid(bidId);
      loadDashboardData();
    } catch (error) {
      console.error("Failed to accept bid", error);
    }
  };

  const handleCompleteContract = async (contractId) => {
    try {
      await contractService.completeContract(contractId);
      loadDashboardData();
    } catch (error) {
      console.error("Failed to complete contract", error);
    }
  };

  const handleOpenReview = (contract) => {
    setReviewTarget({ projectId: contract.projectId, revieweeId: contract.freelancerId });
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    try {
      await reviewService.createReview({
        projectId: reviewTarget.projectId,
        revieweeId: reviewTarget.revieweeId,
        rating,
        comment
      });
      setReviewDialogOpen(false);
      setComment("");
      setRating(5);
      // Optional: Show a success toast
    } catch (error) {
      console.error("Failed to submit review", error);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Client Dashboard</Typography>
        <Button variant="contained" color="primary">Post New Project</Button>
      </Box>

      {/* Summary Metrics */}
      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white', borderRadius: 3 }}>
            <Typography variant="h3" fontWeight="bold">{projects.filter(p => p.status === 'OPEN').length}</Typography>
            <Typography variant="h6">Open Projects</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'secondary.main', color: 'white', borderRadius: 3 }}>
            <Typography variant="h3" fontWeight="bold">{contracts.filter(c => c.status === 'ACTIVE').length}</Typography>
            <Typography variant="h6">Active Contracts</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.main', color: 'white', borderRadius: 3 }}>
            <Typography variant="h3" fontWeight="bold">
              ${payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
            </Typography>
            <Typography variant="h6">Total Spent</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs Layout */}
      <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} centered>
            <Tab label="My Projects & Bids" />
            <Tab label="Contracts" />
            <Tab label="Payments" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Projects Tab */}
          <TabPanel value={tabValue} index={0}>
            {projects.length === 0 ? (
              <Typography color="text.secondary">You haven't posted any projects yet.</Typography>
            ) : (
              projects.map(project => (
                <Paper key={project.id} variant="outlined" sx={{ mb: 3, p: 3, borderRadius: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="bold">{project.title}</Typography>
                    <Chip label={project.status} color={project.status === 'OPEN' ? 'primary' : 'default'} size="small" />
                  </Box>
                  <Typography color="text.secondary" paragraph>{project.description}</Typography>
                  <Typography variant="body2" fontWeight="bold" mb={2}>Budget: ${project.budget.toFixed(2)}</Typography>

                  {/* Bids Section for Open Projects */}
                  {project.status === 'OPEN' && bidsByProject[project.id]?.length > 0 && (
                    <Box mt={3} p={2} bgcolor="#f8f9fa" borderRadius={2}>
                      <Typography variant="subtitle1" fontWeight="bold" mb={2}>Received Bids</Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Freelancer</TableCell>
                            <TableCell>Proposal</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell align="right">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {bidsByProject[project.id].map(bid => (
                            <TableRow key={bid.id}>
                              <TableCell>{bid.freelancerUsername}</TableCell>
                              <TableCell sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {bid.proposal}
                              </TableCell>
                              <TableCell>${bid.amount.toFixed(2)}</TableCell>
                              <TableCell align="right">
                                <Button 
                                  variant="contained" 
                                  color="secondary" 
                                  size="small" 
                                  onClick={() => handleAcceptBid(bid.id)}
                                >
                                  Accept
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  )}
                  {project.status === 'OPEN' && bidsByProject[project.id]?.length === 0 && (
                    <Typography variant="body2" color="text.secondary" mt={2}>No bids received yet.</Typography>
                  )}
                </Paper>
              ))
            )}
          </TabPanel>

          {/* Contracts Tab */}
          <TabPanel value={tabValue} index={1}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Project</TableCell>
                    <TableCell>Freelancer</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>{contract.projectTitle}</TableCell>
                      <TableCell>{contract.freelancerUsername}</TableCell>
                      <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>${contract.amount.toFixed(2)}</TableCell>
                      <TableCell><Chip label={contract.status} color={contract.status === 'ACTIVE' ? 'success' : 'default'} size="small" /></TableCell>
                      <TableCell align="right">
                        {contract.status === 'ACTIVE' && (
                          <Button size="small" variant="outlined" color="primary" onClick={() => handleCompleteContract(contract.id)}>
                            Mark Complete
                          </Button>
                        )}
                        {contract.status === 'COMPLETED' && (
                          <Button size="small" variant="contained" color="secondary" startIcon={<StarIcon />} onClick={() => handleOpenReview(contract)} sx={{ ml: 1 }}>
                            Rate
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {contracts.length === 0 && (
                    <TableRow><TableCell colSpan={6} align="center">No contracts found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Payments Tab */}
          <TabPanel value={tabValue} index={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Project</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>#{payment.id}</TableCell>
                      <TableCell>{payment.projectTitle}</TableCell>
                      <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                      <TableCell color="error.main">-${payment.amount.toFixed(2)}</TableCell>
                      <TableCell><Chip label={payment.status} size="small" /></TableCell>
                    </TableRow>
                  ))}
                  {payments.length === 0 && (
                    <TableRow><TableCell colSpan={5} align="center">No payment history.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

        </Box>
      </Paper>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Leave a Review</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              size="large"
            />
            <TextField
              label="Review Comment"
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitReview} variant="contained" disabled={!comment.trim()}>Submit Review</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClientDashboard;
