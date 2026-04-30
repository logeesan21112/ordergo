import React, { useEffect, useState, useCallback, useMemo } from "react";
import Layout from "../layout/Layout";
import ApiService from "../service/ApiService";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Box, Button, FormControl, InputLabel,
  MenuItem, Select, Typography,
} from "@mui/material";

const DashboardPage = () => {
  const [message, setMessage] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedData, setSelectedData] = useState("count");
  const [deliveryData, setDeliveryData] = useState([]);

  const showMessage = useCallback((msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  }, []);

  const transformDeliveryData = useCallback((deliveries, month, year) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      count: 0,
      amount: 0,
    }));

    deliveries.forEach(({ createdAt, deliveryCharge }) => {
      const date = new Date(createdAt);
      if (date.getMonth() + 1 === month && date.getFullYear() === year) {
        const day = date.getDate() - 1;
        if (day >= 0 && day < daysInMonth) {
          dailyData[day].count++;
          dailyData[day].amount += deliveryCharge;
        }
      }
    });

    return dailyData;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status, deliveries } = await ApiService.getAllDeliveries();
        if (status === 200) {
          setDeliveryData(transformDeliveryData(deliveries, selectedMonth, selectedYear));
        }
      } catch (error) {
        showMessage(error.response?.data?.message || `Error: ${error}`);
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear, selectedData, transformDeliveryData, showMessage]);

  const years = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i), []);

  const months = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      name: new Date(0, i).toLocaleString("default", { month: "long" }),
    })), []);

  const renderTooltip = ({ active, payload, label }) =>
    active && payload?.length && (
      <Box sx={{ bgcolor: "background.paper", p: 1, border: 1, borderColor: "divider" }}>
        <Typography>
          {new Date(selectedYear, selectedMonth - 1, label).toLocaleDateString()}
        </Typography>
        <Typography>
          {selectedData === "count" ? "Deliveries" : "Delivery Charges"}:{" "}
          {selectedData === "amount" ? payload[0].value.toFixed(2) : payload[0].value}
        </Typography>
      </Box>
    );

  return (
    <Layout>
      <Box sx={{ bgcolor: "#fdfdff", minHeight: "100vh", p: 3, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 1200 }}>
          {message && (
            <Typography color="error" align="center" mb={2}>
              {message}
            </Typography>
          )}

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3, justifyContent: "center" }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Year</InputLabel>
              <Select value={selectedYear} label="Year" onChange={(e) => setSelectedYear(+e.target.value)}>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Month</InputLabel>
              <Select value={selectedMonth} label="Month" onChange={(e) => setSelectedMonth(+e.target.value)}>
                {months.map(({ value, name }) => (
                  <MenuItem key={value} value={value}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant={selectedData === "count" ? "contained" : "outlined"}
              onClick={() => setSelectedData("count")}
            >
              Deliveries
            </Button>
            <Button
              variant={selectedData === "amount" ? "contained" : "outlined"}
              onClick={() => setSelectedData("amount")}
            >
              Delivery Charges
            </Button>
          </Box>

          <Box sx={{ height: 400, bgcolor: "white", borderRadius: 2, boxShadow: 1, p: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={deliveryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontFamily: "Roboto" }} />
                <YAxis tick={{ fontFamily: "Roboto" }} />
                <Tooltip content={renderTooltip} />
                <Legend formatter={() => selectedData === "count" ? "Deliveries" : "Delivery Charges"} />
                <Line type="monotone" dataKey={selectedData} stroke="#0063B2" fill="#9CC3D5" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default DashboardPage;