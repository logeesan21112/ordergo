import React, { useState, useEffect } from "react";
import {
  Box, Alert, Typography, Button, Stack, Table, TableHead,
  TableBody, TableRow, TableCell, Pagination, IconButton,
  Avatar, CircularProgress,
} from "@mui/material";
import {
  Edit, Delete, KeyboardArrowDown, KeyboardArrowUp, Person,
} from "@mui/icons-material";
import ApiService from "../../service/ApiService";
import Layout from "../../layout/Layout";
import AddEditExpenseModal from "./AddEditExpenseModal";
import DeleteExpenseModal from "./DeleteExpenseModal";

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [allData, setAllData] = useState([]);
  const [notification, setNotification] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [viewAll, setViewAll] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [openAddEditModal, setOpenAddEditModal] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const itemsPerPage = 10;

  const showMessage = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const user = await ApiService.getLoggedInUserInfo();
      setCurrentUser(user);

      const response = await ApiService.getAllExpenses();
      const allExpenses = Array.isArray(response) ? response : response.expenses || [];

      let visibleExpenses = [];
      if (user.role === "ADMIN" || user.role === "MANAGER") {
        visibleExpenses = allExpenses;
      } else {
        visibleExpenses = allExpenses.filter((expense) => {
          if (typeof expense.user === "string") return expense.user === user.name;
          if (typeof expense.user === "object" && expense.user !== null) return expense.user.name === user.name;
          return false;
        });
      }

      const sorted = [...visibleExpenses].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setAllData(sorted);
      setTotalPages(Math.ceil(sorted.length / itemsPerPage));
      setExpenses(
        viewAll
          ? sorted
          : sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      );
    } catch (error) {
      showMessage(error.response?.data?.message || "Error loading expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [currentPage, viewAll]);

  const handleDetailsClick = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleDelete = async () => {
    if (!expenseToDelete) return;
    try {
      await ApiService.deleteExpenseById(expenseToDelete.id);
      showMessage("Deleted successfully");
      setOpenDeleteModal(false);
      fetchExpenses();
    } catch {
      showMessage("Failed to delete");
    }
  };

  const formatDateId = (dateObj, index) => {
    const month = dateObj.toLocaleString("default", { month: "short" }).toUpperCase();
    return `${allData.length - index}/${month}`;
  };

  return (
    <Layout>
      {notification && <Alert severity="info" sx={{ mb: 2 }}>{notification}</Alert>}

      <Box sx={{ px: 3, py: 3, bgcolor: "#fdfdff" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Expense Records</Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => setOpenAddEditModal(true)}>
              Add Expense
            </Button>
            <Button
              variant="outlined"
              onClick={() => { setViewAll((prev) => !prev); setCurrentPage(1); }}
              disabled={expenses.length === 0}
            >
              {viewAll ? "View Less" : "View All"}
            </Button>
          </Stack>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ bgcolor: "background.paper", borderRadius: 1, boxShadow: 1, overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Rider</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Exp/Mon</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Expense Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Details</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Amount</TableCell>
                  {currentUser?.role === "ADMIN" && (
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>Actions</TableCell>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {expenses.length > 0 ? (
                  expenses.map((expense, idx) => {
                    const isExpanded = expandedRow === expense.id;
                    const userName = typeof expense.user === "string" ? expense.user : "Unknown";
                    const dateObj = new Date(expense.createdAt);
                    const index = allData.findIndex((e) => e.id === expense.id);

                    return (
                      <React.Fragment key={expense.id}>
                        <TableRow hover>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Avatar
  src={expense.userImageUrl ? `/${expense.userImageUrl}` : ""}
  alt={userName}
  sx={{ width: 32, height: 32 }}
>
  {userName.charAt(0).toUpperCase()}
</Avatar>
                              {userName}
                            </Box>
                          </TableCell>
                          <TableCell>{formatDateId(dateObj, index)}</TableCell>
                          <TableCell>{dateObj.toLocaleDateString()}</TableCell>
                          <TableCell>{expense.expenseType?.replace(/_/g, " ") || "N/A"}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleDetailsClick(expense.id)}>
                              {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                            </IconButton>
                          </TableCell>
                          <TableCell align="right">
                            {expense.expenseAmount?.toFixed(2) || "-"}
                          </TableCell>
                          {currentUser?.role === "ADMIN" && (
                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Button
                                  variant="outlined"
                                  startIcon={<Edit />}
                                  onClick={() => { setExpenseToEdit(expense); setOpenAddEditModal(true); }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  startIcon={<Delete />}
                                  onClick={() => { setExpenseToDelete(expense); setOpenDeleteModal(true); }}
                                >
                                  Delete
                                </Button>
                              </Stack>
                            </TableCell>
                          )}
                        </TableRow>

                        {isExpanded && (
                          <TableRow>
                            <TableCell colSpan={7} sx={{ bgcolor: "grey.100" }}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Date & Time</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>{expense.id}</TableCell>
                                    <TableCell>{dateObj.toLocaleString()}</TableCell>
                                    <TableCell>{expense.description || "N/A"}</TableCell>
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
                    <TableCell colSpan={7} align="center">
                      <Typography sx={{ fontSize: "0.875rem" }}>No expenses found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        )}

        {!viewAll && totalPages > 1 && (
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

      <AddEditExpenseModal
        open={openAddEditModal}
        onClose={() => { setOpenAddEditModal(false); setExpenseToEdit(null); }}
        expenseToEdit={expenseToEdit}
        onSave={fetchExpenses}
      />

      <DeleteExpenseModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </Layout>
  );
};

export default ExpensePage;