import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  IconButton,
  Avatar,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import ApiService from "../../service/ApiService";
import AddEditDeliveryModal from "./AddEditDeliveryModal";
import AddPattyModal from "./AddPattyModal";

const statusButtonProps = {
  PENDING: { color: "warning", variant: "contained" },
  PROCESSING: { color: "info", variant: "contained" },
  COMPLETED: { color: "success", variant: "contained" },
  CANCELLED: { color: "error", variant: "contained" },
};

const getFormattedTransactions = (allTxns) => {
  const monthCounters = {};

  const sorted = [...allTxns].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  sorted.forEach((txn) => {
    const date = new Date(txn.createdAt);
    const month = date.toLocaleString("default", { month: "short" }).toUpperCase();
    const yearMonthKey = `${date.getFullYear()}-${date.getMonth()}`;

    if (!monthCounters[yearMonthKey]) {
      monthCounters[yearMonthKey] = sorted.filter(t => {
        const tDate = new Date(t.createdAt);
        return tDate.getFullYear() === date.getFullYear() && tDate.getMonth() === date.getMonth();
      }).length;
    }

    txn.orderId = `${monthCounters[yearMonthKey]--}/${month}`;
  });

  return sorted;
};

const AllDeliveries = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [pattyModalOpen, setPattyModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;
  
  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      const user = await ApiService.getLoggedInUsesInfo();
      setCurrentUser(user);

      const response = await ApiService.getAllTransactions();
      const allTransactions = response.transactions || [];

      let visibleTransactions = [];

      const role = user.role;
      if (role === "ADMIN" || role === "MANAGER") {
        visibleTransactions = allTransactions;
      } else {
        visibleTransactions = allTransactions.filter(
          txn => txn.user?.name === user.name
        );
      }

      const formatted = getFormattedTransactions(visibleTransactions);
      
      setTransactions(formatted);
      setFilteredTransactions(formatted);
      setTotalPages(Math.ceil(formatted.length / itemsPerPage));
    } catch (error) {
      showMessage(error.response?.data?.message || "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  useEffect(() => {
    if (!viewAll) {
      setTotalPages(Math.ceil(filteredTransactions.length / itemsPerPage));
    }
  }, [filteredTransactions, viewAll]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const res = await ApiService.deleteTransactionById(transactionId);
        showMessage(res.message || "Transaction deleted successfully");
        setTransactions(prev => prev.filter(txn => txn.id !== transactionId));
        if (currentUser?.role !== "ADMIN") {
          setFilteredTransactions(prev => prev.filter(txn => txn.id !== transactionId));
        }
      } catch (err) {
        showMessage(err.response?.data?.message || "Failed to delete");
      }
    }
  };

  const currentData = viewAll 
    ? filteredTransactions 
    : filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <>
      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

      <Box sx={{ px: 3, py: 3, bgcolor: "#fdfdff" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Transactions</Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => setPattyModalOpen(true)}>
              Add Patty
            </Button>
            <Button variant="contained" onClick={() => setModalOpen(true)}>
              Add Order
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setViewAll(!viewAll)} 
              disabled={filteredTransactions.length === 0}
            >
              {viewAll ? "View Paginated" : "View All"}
            </Button>
          </Stack>
        </Box>

        <Box sx={{ bgcolor: "background.paper", borderRadius: 1, boxShadow: 1, overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Rider</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Ord/Mon</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Vendor</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Income Type</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Payment Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Details</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Payment Type</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Card/Online</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Delivery</TableCell>
                {currentUser?.role === "ADMIN" && <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((txn) => {
                  const status = txn.paymentStatus?.toUpperCase() || "PENDING";
                  const btnProps = statusButtonProps[status] || { color: "default", variant: "outlined" };

                  return (
                    <React.Fragment key={txn.id}>
                      <TableRow hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar
                              src={txn.user?.profilePic || ""}
                              alt={txn.user?.name || "User"}
                              sx={{ width: 32, height: 32 }}
                            >
                              {!txn.user?.profilePic && (txn.user?.name ? txn.user.name.charAt(0).toUpperCase() : <PersonIcon />)}
                            </Avatar>
                            {txn.user?.name || "Unknown"}
                          </Box>
                        </TableCell>
                        <TableCell>{txn.orderId}</TableCell>
                        <TableCell>{txn.product?.name || "-"}</TableCell>
                        <TableCell>
                          {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>{txn.incomeType || "-"}</TableCell>
                        <TableCell>
                          <Button {...btnProps} sx={{ textTransform: "capitalize", minWidth: 100 }}>
                            {status}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => setExpandedRow(expandedRow === txn.id ? null : txn.id)}>
                            {expandedRow === txn.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell>{txn.paymentType || "-"}</TableCell>
                        <TableCell align="right">{txn.cardOrOnlinePayment?.toFixed(2) || "-"}</TableCell>
                        <TableCell align="right">{txn.deliveryCharge?.toFixed(2) || "-"}</TableCell>
                        {currentUser?.role === "ADMIN" && (
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={() => {
                                  setEditData(txn);
                                  setModalOpen(true);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDelete(txn.id)}
                              >
                                Delete
                              </Button>
                            </Stack>
                          </TableCell>
                        )}
                      </TableRow>
                      {expandedRow === txn.id && (
                        <TableRow>
                          <TableCell colSpan={currentUser?.role === "ADMIN" ? 12 : 11} sx={{ bgcolor: "grey.100" }}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell><strong>ID</strong></TableCell>
                                  <TableCell><strong>Date</strong></TableCell>
                                  <TableCell><strong>Location</strong></TableCell>
                                  <TableCell><strong>Description</strong></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>{txn.id}</TableCell>
                                  <TableCell>
                                    {txn.createdAt ? new Date(txn.createdAt).toLocaleString() : "-"}
                                  </TableCell>
                                  <TableCell>{txn.location || "-"}</TableCell>
                                  <TableCell>{txn.description || txn.remarks || "-"}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={currentUser?.role === "ADMIN" ? 12 : 11} align="center">
                    <Typography sx={{ fontSize: "0.875rem" }}>
                      {loading ? "Loading..." : "No transactions found"}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {!viewAll && filteredTransactions.length > 0 && (
          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, value) => setCurrentPage(value)}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>

      <AddEditDeliveryModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        editData={editData}
        onSave={() => {
          // Refresh data after save
          const fetchData = async () => {
            const response = await ApiService.getAllTransactions();
            const allTransactions = getFormattedTransactions(response.transactions || []);
            setTransactions(allTransactions);
            
            if (currentUser?.role === "ADMIN") {
              setFilteredTransactions(allTransactions);
            } else {
              const userTransactions = allTransactions.filter(
                txn => txn.user?.id === currentUser?.id
              );
              setFilteredTransactions(userTransactions);
            }
          };
          fetchData();
        }}
      />
      <AddPattyModal
        open={pattyModalOpen}
        onClose={() => setPattyModalOpen(false)}
      />
    </>
  );
};

export default AllDeliveries;