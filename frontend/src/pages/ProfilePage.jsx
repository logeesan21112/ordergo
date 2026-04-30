import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import ApiService from "../service/ApiService";
import {
  Box, Typography, Paper, Divider, Alert, Avatar,
  Chip, CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const roleColors = {
  ADMIN: "error",
  MANAGER: "warning",
  USER: "primary",
};

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setUser(await ApiService.getLoggedInUserInfo());
      } catch (error) {
        setMessage(error.response?.data?.message || "Error fetching user data");
        setTimeout(() => setMessage(null), 4000);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  const profileFields = [
    { label: "Full Name", value: user?.name, icon: <PersonIcon fontSize="small" /> },
    { label: "Email Address", value: user?.email, icon: <EmailIcon fontSize="small" /> },
    { label: "Phone Number", value: user?.phoneNumber ? `+94 ${user.phoneNumber}` : "-", icon: <PhoneIcon fontSize="small" /> },
    { label: "Member Since", value: formatDate(user?.createdAt), icon: <CalendarTodayIcon fontSize="small" /> },
  ];

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ maxWidth: 650, margin: "40px auto", p: 3 }}>
        {message && <Alert severity="error" sx={{ mb: 3 }}>{message}</Alert>}

        {user && (
          <>
            {/* header card */}
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden", mb: 3 }}>
              <Box sx={{
                background: "linear-gradient(135deg, #0063B2 0%, #5EB3F6 100%)",
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}>
                <Avatar
                  src={user.imageUrl ? `/${user.imageUrl}` : ""}
                  alt={user.name}
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: 40,
                    bgcolor: "#1976d2",
                    border: "4px solid white",
                    boxShadow: 3,
                  }}
                >
                  {!user.imageUrl && user.name
                    ? user.name.charAt(0).toUpperCase()
                    : null}
                </Avatar>

                <Box textAlign="center">
                  <Typography variant="h5" fontWeight="bold" color="white">
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)" mt={0.5}>
                    {user.email}
                  </Typography>
                </Box>

                <Chip
                  icon={<BadgeIcon sx={{ color: "white !important" }} />}
                  label={user.role}
                  color={roleColors[user.role] || "default"}
                  sx={{
                    fontWeight: "bold",
                    color: "white",
                    px: 1,
                  }}
                />
              </Box>
            </Paper>

            {/* details card */}
            <Paper elevation={3} sx={{ borderRadius: 3, p: 4 }}>
              <Typography variant="h6" fontWeight="bold" mb={2} color="text.primary">
                Account Details
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {profileFields.map((field) => (
                  <Box
                    key={field.label}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "grey.50",
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                      {field.icon}
                      <Typography variant="body2" fontWeight={500}>
                        {field.label}
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={500} color="text.primary">
                      {field.value || "-"}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </>
        )}
      </Box>
    </Layout>
  );
};

export default ProfilePage;