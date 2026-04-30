import React, { useEffect, useState, useCallback } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  Box, Typography, Table, TableBody, TableCell, TableHead,
  TableRow, Button, Avatar, CircularProgress, FormControl,
  InputLabel, Select, MenuItem, TextField, Pagination,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const DeliveryFilterComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isAdmin = ApiService.isAdmin() || ApiService.getRole() === "MANAGER";

  const [selectedUser, setSelectedUser] = useState(() => {
    const userParam = searchParams.get("user");
    return userParam || (isAdmin ? "all" : "");
  });

  const [selectedDate, setSelectedDate] = useState(searchParams.get("date") || "all");
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 5;

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const updateQueryParams = useCallback((user, date) => {
    const params = new URLSearchParams();
    if (user && user !== "all") params.set("user", user);
    if (date && date !== "all") params.set("date", date);
    const queryString = params.toString();
    navigate(
      { pathname: location.pathname, search: queryString ? `?${queryString}` : "" },
      { replace: true }
    );
  }, [navigate, location.pathname]);

  const fetchData = useCallback(async (user, date) => {
    setLoading(true);
    try {
      let response;
      if (user !== "all" && date !== "all") {
        response = await ApiService.getUserDateReviews(user, date);
      } else if (user !== "all") {
        response = await ApiService.getUserReviews(user);
      } else if (date !== "all") {
        response = await ApiService.getDateReviews(date);
      } else {
        setReviews([]);
        setTotalPages(0);
        return;
      }

      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response && typeof response === "object" && Object.keys(response).length > 0) {
        data = [response];
      }

      setReviews(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      showMessage(error.response?.data?.message || "Error fetching data");
      setReviews([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split("T")[0];

        if (isAdmin) {
          const userData = await ApiService.getAllUsers();
          setUsers(userData?.users || []);
          setSelectedUser("all");
          setSelectedDate(today);
          updateQueryParams("all", today);
          await fetchData("all", today);
        } else {
          const user = await ApiService.getLoggedInUserInfo();
          if (user) {
            setUsers([{ id: user.id, name: user.name }]);
            setSelectedUser(user.id);
            setSelectedDate(today);
            updateQueryParams(user.id, today);
            await fetchData(user.id, today);
          }
        }
      } catch (error) {
        showMessage(error.response?.data?.message || "Initialization failed");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [isAdmin, fetchData, updateQueryParams]);

  const handleFilterClick = async () => {
    setLoading(true);
    try {
      const actualUser = isAdmin ? selectedUser : users[0]?.id;
      setCurrentPage(1);
      updateQueryParams(actualUser, selectedDate);
      await fetchData(actualUser, selectedDate);
      setHasAppliedFilters(true);
    } catch (error) {
      showMessage(error.response?.data?.message || "Error applying filters");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = async () => {
    const today = new Date().toISOString().split("T")[0];
    const resetUser = isAdmin ? "all" : users[0]?.id;
    setSelectedUser(resetUser);
    setSelectedDate(today);
    setCurrentPage(1);
    updateQueryParams(resetUser, today);
    await fetchData(resetUser, today);
    setHasAppliedFilters(false);
  };

  const formatNumber = (num) => (typeof num === "number" ? num.toFixed(2) : "-");

  return (
    <>
      {message && (
        <Typography color="error" sx={{ mb: 2 }}>{message}</Typography>
      )}

      <Box sx={{ px: 3, py: 3, bgcolor: "#fdfbfb" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Rider</InputLabel>
            <Select
              value={selectedUser}
              label="Rider"
              onChange={(e) => setSelectedUser(e.target.value)}
              disabled={!isAdmin}
            >
              <MenuItem value="all">All</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Date"
            type="date"
            value={selectedDate === "all" ? "" : selectedDate}
            onChange={(e) => setSelectedDate(e.target.value === "" ? "all" : e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />

          <Button variant="contained" onClick={handleFilterClick} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Apply Filters"}
          </Button>

          {hasAppliedFilters && (
            <Button variant="outlined" onClick={handleClearFilters} disabled={loading}>
              Clear Filters
            </Button>
          )}
        </Box>

        <Box sx={{ bgcolor: "background.paper", borderRadius: 1, boxShadow: 1, overflowX: "auto" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : reviews.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Rider</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Delivery Charge</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Petty Cash</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Card/Online</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Total Expenses</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((review, idx) => (
                    <TableRow hover key={idx}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar
                            src={review.profileImageUrl || ""}
                            alt={review.userName}
                            sx={{ width: 32, height: 32 }}
                          >
                            {!review.profileImageUrl &&
                              (review.userName
                                ? review.userName.charAt(0).toUpperCase()
                                : <PersonIcon />)}
                          </Avatar>
                          {review.userName || "Unknown"}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {review.date ? new Date(review.date).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell align="right">{formatNumber(review.totalDeliveryCharge)}</TableCell>
                      <TableCell align="right">{formatNumber(review.totalPettyCash)}</TableCell>
                      <TableCell align="right">{formatNumber(review.totalCardOrOnlinePayment)}</TableCell>
                      <TableCell align="right">{formatNumber(review.totalExpenses)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {formatNumber(review.balanceAmount)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <Typography sx={{ p: 3 }}>No review data found</Typography>
          )}
        </Box>

        {reviews.length > 0 && (
          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, value) => setCurrentPage(value)}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default DeliveryFilterComponent;