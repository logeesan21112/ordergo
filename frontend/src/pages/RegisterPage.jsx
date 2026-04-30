import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";

import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Avatar,
} from "@mui/material";

import MarketingPanel from "./MarketingPanel";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPw, setRegPw] = useState("");
  const [regPwC, setRegPwC] = useState("");
  const [phone, setPhone] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [regErrors, setRegErrors] = useState({});
  const [regMsg, setRegMsg] = useState({ text: "", error: false });

  const validateReg = () => {
    const errs = {};

    if (!name.trim()) errs.name = "Name is required";
    if (!regEmail.trim()) errs.email = "Email is required";
    if (!regPw.trim()) errs.password = "Password is required";
    if (regPw !== regPwC) errs.confirm = "Passwords do not match";

    const ph = phone.trim();
    if (!ph) errs.phone = "Phone is required";

    setRegErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateReg()) return;

    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("email", regEmail);
      fd.append("password", regPw);
      fd.append(
        "phoneNumber",
        phone.startsWith("0") ? phone.substring(1) : phone
      );

      if (imageFile) fd.append("imageFile", imageFile);

      await ApiService.registerUser(fd);

      setRegMsg({
        text: "Account created! Please sign in.",
        error: false,
      });

      // optional auto redirect after success
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setRegMsg({
        text: err.response?.data?.message || "Registration failed.",
        error: true,
      });
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>

      {/* LEFT PANEL */}
      <MarketingPanel />

      {/* RIGHT PANEL */}
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

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Create your account
          </Typography>

          {regMsg.text && (
            <Alert severity={regMsg.error ? "error" : "success"} sx={{ mb: 2 }}>
              {regMsg.text}
            </Alert>
          )}

          <Box component="form" onSubmit={handleRegister}>

            <TextField
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={Boolean(regErrors.name)}
              helperText={regErrors.name}
              sx={{ mb: 2.5 }}
              fullWidth
            />

            <TextField
              label="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              sx={{ mb: 2.5 }}
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              value={regPw}
              onChange={(e) => setRegPw(e.target.value)}
              sx={{ mb: 2.5 }}
              fullWidth
            />

            <TextField
              label="Confirm Password"
              type="password"
              value={regPwC}
              onChange={(e) => setRegPwC(e.target.value)}
              sx={{ mb: 2.5 }}
              fullWidth
            />

            <TextField
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{ mb: 2.5 }}
              fullWidth
            />

            <Button
              component="label"
              variant="outlined"
              fullWidth
              sx={{ mb: 3 }}
            >
              {imagePreview ? (
                <Avatar src={imagePreview} sx={{ width: 30, height: 30 }} />
              ) : (
                "Upload Photo"
              )}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImage}
              />
            </Button>

            <Button type="submit" variant="contained" fullWidth>
              Create account
            </Button>

            <Typography sx={{ textAlign: "center", mt: 2 }}>
              Already have an account?{" "}
              <Typography
                component="span"
                onClick={() => navigate("/login")}
                sx={{ color: "primary.main", cursor: "pointer" }}
              >
                Sign in
              </Typography>
            </Typography>

          </Box>
        </Box>
      </Box>
    </Box>
  );
}
