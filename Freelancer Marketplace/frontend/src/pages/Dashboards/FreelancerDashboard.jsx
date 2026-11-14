import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Container, Grid, Paper, Button, Tabs, Tab, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { bidService } from '../../services/bidService';
import { contractService } from '../../services/contractService';
import { paymentService } from '../../services/paymentService';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const FreelancerDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  
  const [bids, setBids] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [bidsData, contData, payData] = await Promise.all([
        bidService.getMyBids(),
        contractService.getMyContracts(),
        paymentService.getPaymentHistory()
      ]);
      setBids(bidsData);
      setContracts(contData);
      setPayments(payData);
    } catch (error) {
      console.error("Error loading freelancer dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  // Calculate earnings (only PAID payments)
  const totalEarnings = payments
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Freelancer Dashboard</Typography>
        <Button variant="contained" color="primary" component={Link} to="/projects">Find Projects</Button>
      </Box>

      {/* Summary Metrics */}
      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white', borderRadius: 3 }}>
            <Typography variant="h3" fontWeight="bold">{bids.filter(b => b.status === 'PENDING').length}</Typography>
            <Typography variant="h6">Active Bids</Typography>
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
            <Typography variant="h3" fontWeight="bold">${totalEarnings.toFixed(2)}</Typography>
            <Typography variant="h6">Total Earnings</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs Layout */}
      <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} centered>
            <Tab label="My Proposals" />
            <Tab label="Contracts" />
            <Tab label="Earnings" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Bids Tab */}
          <TabPanel value={tabValue} index={0}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Project</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bids.map((bid) => (
                    <TableRow key={bid.id}>
                      <TableCell fontWeight="bold">{bid.projectTitle}</TableCell>
                      <TableCell>{new Date(bid.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>${bid.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={bid.status} 
                          color={bid.status === 'ACCEPTED' ? 'success' : bid.status === 'REJECTED' ? 'error' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button component={Link} to={`/projects/${bid.projectId}`} size="small" variant="outlined">
                          View Project
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {bids.length === 0 && (
                    <TableRow><TableCell colSpan={5} align="center">You haven't submitted any proposals yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Contracts Tab */}
          <TabPanel value={tabValue} index={1}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Project</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>{contract.projectTitle}</TableCell>
                      <TableCell>{contract.clientUsername}</TableCell>
                      <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>${contract.amount.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Chip label={contract.status} color={contract.status === 'ACTIVE' ? 'success' : 'default'} size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                  {contracts.length === 0 && (
                    <TableRow><TableCell colSpan={5} align="center">No contracts found.</TableCell></TableRow>
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
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>#{payment.id}</TableCell>
                      <TableCell>{payment.projectTitle}</TableCell>
                      <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                      <TableCell color="success.main" sx={{ fontWeight: 'bold' }}>+${payment.amount.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={payment.status} 
                          color={payment.status === 'PAID' ? 'success' : payment.status === 'PROCESSING' ? 'info' : 'warning'}
                          size="small" 
                        />
                      </TableCell>
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
    </Container>
  );
};

export default FreelancerDashboard;
