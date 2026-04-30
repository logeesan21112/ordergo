import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import {
  Modal, Box, TextField, Typography, Button,
  Avatar, Backdrop, Fade, CardContent, InputAdornment,
} from "@mui/material";

const EditRiderModal = ({ open, handleClose, rider, onSubmit }) => {
  const [form, setForm] = useState({
    name: "", email: "", role: "", phoneNumber: "",
    imageFile: null, imageUrl: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({
      name: rider?.name || "",
      email: rider?.email || "",
      role: rider?.role || "",
      phoneNumber: rider?.phoneNumber || "",
      imageFile: null,
      imageUrl: rider?.imageUrl ? `/${rider.imageUrl}` : "",
    });
    setErrors({});
  }, [rider]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, imageFile: file }));
    const reader = new FileReader();
    reader.onloadend = () => setForm((prev) => ({ ...prev, imageUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";

    const phone = form.phoneNumber.trim();
    if (!phone) {
      newErrors.phoneNumber = "Phone number is required";
    } else {
      const isNineDigits = /^\d{9}$/.test(phone);
      const isTenDigits = /^0\d{9}$/.test(phone);
      if (!isNineDigits && !isTenDigits) {
        newErrors.phoneNumber = "Enter a valid Sri Lankan number (07XXXXXXXX or 7XXXXXXXX)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const normalizePhone = (phone) => {
    const p = phone.trim();
    return p.startsWith("0") ? p.substring(1) : p;
  };

  const submitHandler = async () => {
    if (!validate()) return;
    try {
      const formData = new FormData();
      if (form.name) formData.append("name", form.name);
      if (form.email) formData.append("email", form.email);
      if (form.role) formData.append("role", form.role);
      formData.append("phoneNumber", normalizePhone(form.phoneNumber));
      if (form.imageFile) formData.append("imageFile", form.imageFile);

      if (rider?.id) await ApiService.updateUser(rider.id, formData);

      onSubmit(Boolean(rider?.id));
      handleClose();
    } catch (error) {
      console.error("Failed to save rider", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition
      BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
      <Fade in={open}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "background.paper", borderRadius: 2, boxShadow: 24, p: 3,
        }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
              {rider ? "Edit Rider" : "Add Rider"}
            </Typography>

            <TextField fullWidth name="name" label="Rider Name"
              value={form.name} onChange={handleChange} margin="normal"
              error={Boolean(errors.name)} helperText={errors.name} required />

            <TextField fullWidth name="email" label="Email Address" type="email"
              value={form.email} onChange={handleChange} margin="normal"
              error={Boolean(errors.email)} helperText={errors.email} required />

            <TextField fullWidth name="role" label="Role"
              value={form.role} onChange={handleChange}
              disabled={Boolean(rider)} margin="normal" />

            <TextField fullWidth name="phoneNumber" label="Contact Number" type="tel"
              value={form.phoneNumber} onChange={handleChange} margin="normal"
              error={Boolean(errors.phoneNumber)} helperText={errors.phoneNumber || "Enter 07XXXXXXXX"}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">+94</InputAdornment>,
              }}
            />

            <Box mt={2} mb={2}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Rider Image
                <input hidden accept="image/*" type="file" onChange={handleImageChange} />
              </Button>
              {form.imageUrl && (
                <Box mt={2} display="flex" justifyContent="center">
                  <Avatar src={form.imageUrl} alt="Rider Preview" sx={{ width: 100, height: 100 }} />
                </Box>
              )}
            </Box>

            <Button variant="contained" fullWidth onClick={submitHandler} sx={{ mt: 2 }}>
              {rider ? "Update Rider" : "Add Rider"}
            </Button>
          </CardContent>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EditRiderModal;