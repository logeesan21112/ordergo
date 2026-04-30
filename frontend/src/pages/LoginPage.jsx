import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";

import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import MarketingPanel from "./MarketingPanel";

export default function LoginPage() {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginMsg, setLoginMsg] = useState({ text: "", error: false });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await ApiService.loginUser({
        email: loginEmail,
        password: loginPw,
      });

      ApiService.saveToken(res.token);
      ApiService.saveRole(res.role);

      setLoginMsg({ text: "Welcome back! Redirecting…", error: false });
      setTimeout(() => navigate("/deliveries"), 1000);
    } catch (err) {
      setLoginMsg({
        text: err.response?.data?.message || "Invalid credentials.",
        error: true,
      });

      setTimeout(() => setLoginMsg({ text: "", error: false }), 4000);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <MarketingPanel />

      <Box
        sx={{
          flex: 1,
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 440 }}>

          <Box component="form" onSubmit={handleLogin}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Welcome back
            </Typography>

            <Typography sx={{ mb: 3 }}>
              Sign in to your account to continue
            </Typography>

            {loginMsg.text && (
              <Alert severity={loginMsg.error ? "error" : "success"} sx={{ mb: 2 }}>
                {loginMsg.text}
              </Alert>
            )}

            <TextField
              label="Email address"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              sx={{ mb: 2.5 }}
              fullWidth
              required
            />

            <TextField
              label="Password"
              type={showLoginPw ? "text" : "password"}
              value={loginPw}
              onChange={(e) => setLoginPw(e.target.value)}
              sx={{ mb: 3 }}
              fullWidth
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowLoginPw(!showLoginPw)}>
                      {showLoginPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button type="submit" variant="contained" fullWidth sx={{ mb: 3 }}>
              Sign in
            </Button>

            <Typography textAlign="center">
              Don't have an account?{" "}
              <Typography
                component="span"
                onClick={() => navigate("/register")}
                sx={{ color: "primary.main", cursor: "pointer" }}
              >
                Create account
              </Typography>
            </Typography>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}
