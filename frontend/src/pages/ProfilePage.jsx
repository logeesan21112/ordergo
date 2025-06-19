import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import ApiService from "../service/ApiService";
import { Box, Typography, Paper, Divider, Alert } from "@mui/material";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setUser(await ApiService.getLoggedInUsesInfo());
      } catch (error) {
        setMessage(error.response?.data?.message || "Error fetching user data");
        setTimeout(() => setMessage(null), 4000);
      }
    };
    fetchUserInfo();
  }, []);

  const profileFields = [
    { label: "Name", value: user?.name },
    { label: "Email", value: user?.email },
    { label: "Phone Number", value: user?.phoneNumber },
    { label: "Role", value: user?.role, transform: "capitalize" }
  ];

  return (
    <Layout>
      <Box sx={{ maxWidth: 600, margin: "40px auto", p: 3 }}>
        {message && <Alert severity="error" sx={{ mb: 3 }}>{message}</Alert>}

        {user && (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
              Hello, {user.name} 🥳
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {profileFields.map((field) => (
                <Box key={field.label} sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    {field.label}
                  </Typography>
                  <Typography variant="body1" textTransform={field.transform}>
                    {field.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

export default ProfilePage;