import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import {
  Modal, Box, TextField, Typography, Button,
  Avatar, Backdrop, Fade, CardContent, InputAdornment,
} from "@mui/material";

const initialFormState = {
  name: "",
  email: "",
  phoneNumber: "",
  address: "",
  imageFile: null,
  imageUrl: "",
};

const AddEditVendorModal = ({ open, handleClose, vendor, onSubmit }) => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(vendor ? {
      name: vendor.name || "",
      email: vendor.email || "",
      // show stored 9 digits as-is in field
      phoneNumber: vendor.phoneNumber || "",
      address: vendor.address || "",
      imageFile: null,
      imageUrl: vendor.imageUrl ? `/${vendor.imageUrl}` : "",
    } : initialFormState);
  }, [vendor]);

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
    if (!form.address.trim()) newErrors.address = "Address is required";

    const phone = form.phoneNumber.trim();
    if (!phone) {
      newErrors.phoneNumber = "Phone number is required";
    } else {
      // accept either 9 digits (already stored) or 10 digits starting with 0
      const isNineDigits = /^\d{9}$/.test(phone);
      const isTenDigits = /^0\d{9}$/.test(phone);
      if (!isNineDigits && !isTenDigits) {
        newErrors.phoneNumber = "Enter a valid Sri Lankan number (07XXXXXXXX or 7XXXXXXXX)";
      }
    }

    const email = form.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // strip leading 0 if present before saving
  const normalizePhone = (phone) => {
    const p = phone.trim();
    return p.startsWith("0") ? p.substring(1) : p;
  };

  const submitHandler = async () => {
    if (!validate()) return;
    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("phoneNumber", normalizePhone(form.phoneNumber));
      formData.append("address", form.address.trim());
      const trimmedEmail = form.email.trim();
      if (trimmedEmail) formData.append("email", trimmedEmail);
      if (form.imageFile) formData.append("imageFile", form.imageFile);

      const isEditing = Boolean(vendor?.id);
      if (isEditing) {
        formData.append("vendorId", vendor.id);
        await ApiService.updateVendor(formData);
      } else {
        await ApiService.addVendor(formData);
      }
      onSubmit(isEditing);
      handleClose();
    } catch (error) {
      console.error("Failed to save vendor", error);
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
              {vendor ? "Edit Vendor" : "Add Vendor"}
            </Typography>

            <TextField
              fullWidth name="name" label="Vendor Name"
              value={form.name} onChange={handleChange} margin="normal"
              error={Boolean(errors.name)} helperText={errors.name}
            />
            <TextField
              fullWidth name="email" label="Email" type="email"
              value={form.email} onChange={handleChange} margin="normal"
              error={Boolean(errors.email)} helperText={errors.email}
            />
            <TextField
              fullWidth name="phoneNumber" label="Contact Number" type="tel"
              value={form.phoneNumber} onChange={handleChange} margin="normal"
              error={Boolean(errors.phoneNumber)} helperText={errors.phoneNumber || "Enter 07XXXXXXXX"}
              InputProps={{
                startAdornment: <InputAdornment position="start">+94</InputAdornment>,
              }}
            />
            <TextField
              fullWidth name="address" label="Address"
              value={form.address} onChange={handleChange} margin="normal"
              error={Boolean(errors.address)} helperText={errors.address}
            />

            <Box mt={2} mb={2}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Vendor Image
                <input hidden accept="image/*" type="file" onChange={handleImageChange} />
              </Button>
              {form.imageUrl && (
                <Box mt={2} display="flex" justifyContent="center">
                  <Avatar src={form.imageUrl} alt="Vendor Preview" sx={{ width: 100, height: 100 }} />
                </Box>
              )}
            </Box>

            <Button variant="contained" fullWidth onClick={submitHandler} sx={{ mt: 2 }}>
              {vendor ? "Update Vendor" : "Add Vendor"}
            </Button>
          </CardContent>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddEditVendorModal;