import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Stack, Table, TableHead, TableBody,
  TableRow, TableCell, Pagination, IconButton, Avatar, Alert,
} from "@mui/material";
import {
  Edit as EditIcon, Delete as DeleteIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import ApiService from "../../service/ApiService";
import AddEditDeliveryModal from "./AddEditDeliveryModal";
import AddPettyCashModal from "./AddPattyModal";

const statusButtonProps = {
  PENDING: { color: "warning", variant: "contained" },
  PROCESSING: { color: "info", variant: "contained" },
  COMPLETED: { color: "success", variant: "contained" },
  CANCELLED: { color: "error", variant: "contained" },
};

const getFormattedDeliveries = (allDeliveries) => {
  const monthCounters = {};

  const sorted = [...allDeliveries].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  sorted.forEach((delivery) => {
    const date = new Date(delivery.createdAt);
    const month = date.toLocaleString("default", { month: "short" }).toUpperCase();
    const yearMonthKey = `${date.getFullYear()}-${date.getMonth()}`;

    if (!monthCounters[yearMonthKey]) {
      monthCounters[yearMonthKey] = sorted.filter((d) => {
        const dDate = new Date(d.createdAt);
        return dDate.getFullYear() === date.getFullYear() && dDate.getMonth() === date.getMonth();
      }).length;
    }

    delivery.deliveryId = `${monthCounters[yearMonthKey]--}/${month}`;
  });

  return sorted;
};

const AllDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [message, setMessage] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [pettyCashModalOpen, setPettyCashModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const user = await ApiService.getLoggedInUserInfo();
        setCurrentUser(user);

        const response = await ApiService.getAllDeliveries();
        const allDeliveries = response.deliveries || [];

        let visibleDeliveries = [];
        const role = user.role;

        if (role === "ADMIN" || role === "MANAGER") {
          visibleDeliveries = allDeliveries;
        } else {
          visibleDeliveries = allDeliveries.filter((d) => d.user?.name === user.name);
        }

        const formatted = getFormattedDeliveries(visibleDeliveries);
        setDeliveries(formatted);
        setFilteredDeliveries(formatted);
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
      setTotalPages(Math.ceil(filteredDeliveries.length / itemsPerPage));
    }
  }, [filteredDeliveries, viewAll]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleDelete = async (deliveryId) => {
    if (window.confirm("Are you sure you want to delete this delivery?")) {
      try {
        const res = await ApiService.deleteDeliveryById(deliveryId);
        showMessage(res.message || "Delivery deleted successfully");
        setDeliveries((prev) => prev.filter((d) => d.id !== deliveryId));
        if (currentUser?.role !== "ADMIN") {
          setFilteredDeliveries((prev) => prev.filter((d) => d.id !== deliveryId));
        }
      } catch (err) {
        showMessage(err.response?.data?.message || "Failed to delete");
      }
    }
  };

  const refreshDeliveries = async () => {
    const response = await ApiService.getAllDeliveries();
    const allDeliveries = getFormattedDeliveries(response.deliveries || []);
    setDeliveries(allDeliveries);

    if (currentUser?.role === "ADMIN" || currentUser?.role === "MANAGER") {
      setFilteredDeliveries(allDeliveries);
    } else {
      setFilteredDeliveries(allDeliveries.filter((d) => d.user?.id === currentUser?.id));
    }
  };

  const currentData = viewAll
    ? filteredDeliveries
    : filteredDeliveries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <>
      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

      <Box sx={{ px: 3, py: 3, bgcolor: "#fdfdff" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Deliveries</Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => setPettyCashModalOpen(true)}>
              Add Petty Cash
            </Button>
            <Button variant="contained" onClick={() => setModalOpen(true)}>
              Add Delivery
            </Button>
            <Button
              variant="outlined"
              onClick={() => setViewAll(!viewAll)}
              disabled={filteredDeliveries.length === 0}
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
                <TableCell sx={{ fontWeight: "bold" }}>Del/Mon</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Vendor</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Income Type</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Payment Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Details</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Payment Type</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Card/Online</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Delivery Charge</TableCell>
                {currentUser?.role === "ADMIN" && (
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((delivery) => {
                  const status = delivery.paymentStatus?.toUpperCase() || "PENDING";
                  const btnProps = statusButtonProps[status] || { color: "default", variant: "outlined" };

                  return (
                    <React.Fragment key={delivery.id}>
                      <TableRow hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar
                              src={delivery.user?.imageUrl ? `/${delivery.user.imageUrl}` : ""}
                              alt={delivery.user?.name || "User"}
                              sx={{ width: 32, height: 32 }}
                            >
                              {delivery.user?.name
                                ? delivery.user.name.charAt(0).toUpperCase()
                                : <PersonIcon />}
                            </Avatar>
                            {delivery.user?.name || "Unknown"}
                          </Box>
                        </TableCell>
                        <TableCell>{delivery.deliveryId}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar
                              src={delivery.vendor?.imageUrl ? `/${delivery.vendor.imageUrl}` : ""}
                              alt={delivery.vendor?.name || "Vendor"}
                              sx={{ width: 32, height: 32 }}
                            >
                              {delivery.vendor?.name
                                ? delivery.vendor.name.charAt(0).toUpperCase()
                                : null}
                            </Avatar>
                            {delivery.vendor?.name || "-"}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {delivery.createdAt ? new Date(delivery.createdAt).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>{delivery.incomeType || "-"}</TableCell>
                        <TableCell>
                          <Button {...btnProps} sx={{ textTransform: "capitalize", minWidth: 100 }}>
                            {status}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => setExpandedRow(expandedRow === delivery.id ? null : delivery.id)}>
                            {expandedRow === delivery.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </TableCell>
                        <TableCell>{delivery.paymentType || "-"}</TableCell>
                        <TableCell align="right">{delivery.cardOrOnlinePayment?.toFixed(2) || "-"}</TableCell>
                        <TableCell align="right">{delivery.deliveryCharge?.toFixed(2) || "-"}</TableCell>
                        {currentUser?.role === "ADMIN" && (
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={() => { setEditData(delivery); setModalOpen(true); }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDelete(delivery.id)}
                              >
                                Delete
                              </Button>
                            </Stack>
                          </TableCell>
                        )}
                      </TableRow>

                      {expandedRow === delivery.id && (
                        <TableRow>
                          <TableCell
                            colSpan={currentUser?.role === "ADMIN" ? 11 : 10}
                            sx={{ bgcolor: "grey.100" }}
                          >
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
                                  <TableCell>{delivery.id}</TableCell>
                                  <TableCell>
                                    {delivery.createdAt ? new Date(delivery.createdAt).toLocaleString() : "-"}
                                  </TableCell>
                                  <TableCell>{delivery.location || "-"}</TableCell>
                                  <TableCell>{delivery.description || "-"}</TableCell>
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
                  <TableCell colSpan={currentUser?.role === "ADMIN" ? 11 : 10} align="center">
                    <Typography sx={{ fontSize: "0.875rem" }}>No deliveries found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {!viewAll && filteredDeliveries.length > 0 && (
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
        onClose={() => { setModalOpen(false); setEditData(null); }}
        editData={editData}
        onSave={() => {
          setModalOpen(false);
          setEditData(null);
          refreshDeliveries();
        }}
      />

      <AddPettyCashModal
        open={pettyCashModalOpen}
        onClose={() => setPettyCashModalOpen(false)}
      />
    </>
  );
};

export default AllDeliveries;