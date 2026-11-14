import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip,
  CircularProgress
} from '@mui/material';
import { paymentService } from '../../services/paymentService';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real app, this would come from AuthContext
  const currentRole = localStorage.getItem('role') || 'FREELANCER'; 

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await paymentService.getPaymentHistory();
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payment history", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'PROCESSING': return 'info';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          Payment History
        </Typography>
        <Chip label={`${payments.length} Records`} color="primary" variant="outlined" />
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : payments.length === 0 ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">No payments found.</Typography>
          </Box>
        ) : (
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'background.default' }}>
              <TableRow>
                <TableCell><Typography fontWeight={600}>Transaction ID</Typography></TableCell>
                <TableCell><Typography fontWeight={600}>Project</Typography></TableCell>
                <TableCell><Typography fontWeight={600}>{currentRole === 'CLIENT' ? 'Paid To' : 'Received From'}</Typography></TableCell>
                <TableCell><Typography fontWeight={600}>Date</Typography></TableCell>
                <TableCell align="right"><Typography fontWeight={600}>Amount</Typography></TableCell>
                <TableCell align="center"><Typography fontWeight={600}>Status</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}>
                  <TableCell>#{row.id.toString().padStart(6, '0')}</TableCell>
                  <TableCell>{row.projectTitle}</TableCell>
                  <TableCell>{currentRole === 'CLIENT' ? row.freelancerUsername : row.clientUsername}</TableCell>
                  <TableCell>{new Date(row.paymentDate).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={600} color={currentRole === 'CLIENT' ? 'error.main' : 'success.main'}>
                      {currentRole === 'CLIENT' ? '-' : '+'}${row.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={row.status} 
                      color={getStatusColor(row.status)} 
                      size="small" 
                      sx={{ fontWeight: 600, px: 1 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default PaymentHistory;
