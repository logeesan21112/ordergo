import React, { useEffect, useState } from "react";
import ApiService from "../../service/ApiService";
import {
  Box, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, CircularProgress,
} from "@mui/material";

const TodayDeliveriesComponent = () => {
  const [todayTotals, setTodayTotals] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTodayTotals = async () => {
      try {
        const totals = await ApiService.getTodayTotals();
        setTodayTotals(totals);
      } catch (error) {
        showMessage(error.response?.data?.message || "Error fetching today's summary");
      }
    };
    fetchTodayTotals();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const formatAmount = (val) =>
    val !== null && val !== undefined ? Number(val).toFixed(2) : "-";

  const formatDateTime = (inputDate) => {
    const d = new Date(inputDate);
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${ampm} ${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  if (!todayTotals) {
    return (
      <Box sx={{ px: 3, py: 3, bgcolor: "#fbfdfb", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  const {
    totalDeliveryCharge,
    totalPettyCash,
    totalCardOrOnlinePayment,
    totalExpenses,
    balanceAmount,
    date,
  } = todayTotals;

  const totalDP = totalDeliveryCharge + totalPettyCash;
  const totalCE = totalCardOrOnlinePayment + totalExpenses;

  return (
    <Box sx={{ px: 3, py: 3, bgcolor: "#fbfdfb" }}>
      {message && (
        <Typography color="error" sx={{ mb: 2 }}>{message}</Typography>
      )}

      <Box sx={{ bgcolor: "background.paper", borderRadius: 1, boxShadow: 1, overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Delivery Charge</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Petty Cash</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Card/Online</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Expenses</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>Balance Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* amounts row */}
            <TableRow hover>
              <TableCell>{date ? formatDateTime(date) : "-"}</TableCell>
              <TableCell align="right">{formatAmount(totalDeliveryCharge)}</TableCell>
              <TableCell align="right">{formatAmount(totalPettyCash)}</TableCell>
              <TableCell align="right">{formatAmount(totalCardOrOnlinePayment)}</TableCell>
              <TableCell align="right">{formatAmount(totalExpenses)}</TableCell>
              <TableCell />
            </TableRow>

            {/* totals row */}
            <TableRow hover>
              <TableCell />
              <TableCell />
              <TableCell align="right" sx={{ fontWeight: "bold" }}>{formatAmount(totalDP)}</TableCell>
              <TableCell />
              <TableCell align="right" sx={{ fontWeight: "bold" }}>{formatAmount(totalCE)}</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>{formatAmount(balanceAmount)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default TodayDeliveriesComponent;