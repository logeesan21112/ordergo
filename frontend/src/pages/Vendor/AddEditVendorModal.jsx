import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import {
  Modal,
  Box,
  TextField,
  Typography,
  Button,
  Avatar,
  Backdrop,
  Fade,
  CardContent,
} from "@mui/material";

const initialFormState = {
  name: '',
  email: '',
  phoneNumber: '',
  address: '',
  imageFile: null,
  imageUrl: '',
};

const AddEditVendorModal = ({ open, handleClose, vendor, onSubmit }) => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(vendor ? {
      name: vendor.name || '',
      email: vendor.email || '',
      phoneNumber: vendor.phoneNumber || '',
      address: vendor.address || '',
      imageFile: null,
      imageUrl: vendor.imageUrl || '',
    } : initialFormState);
  }, [vendor]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm(prev => ({ ...prev, imageFile: file }));

    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, imageUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.address.trim()) newErrors.address = "Address is required";

    const phone = form.phoneNumber.trim();
    if (!phone) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    } else if (phone[0] !== "0") {
      newErrors.phoneNumber = "Phone number must start with 0";
    } else if (phone[1] === "0") {
      newErrors.phoneNumber = "Second digit cannot be 0";
    }

    const email = form.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async () => {
    if (!validate()) return;

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("phoneNumber", form.phoneNumber.trim());
      formData.append("address", form.address.trim());

      const trimmedEmail = form.email.trim();
      if (trimmedEmail !== "") {
        formData.append("email", trimmedEmail);
      }

      if (form.imageFile) {
        formData.append("imageFile", form.imageFile);
      }

      const isEditing = Boolean(vendor?.id);
      if (isEditing) {
        formData.append("productId", vendor.id);
        await ApiService.updateProduct(formData);
      } else {
        await ApiService.addProduct(formData);
      }

      onSubmit(isEditing);
      handleClose();
    } catch (error) {
      console.error("Failed to save vendor", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
        }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
              {vendor ? "Edit Vendor" : "Add Vendor"}
            </Typography>

            {['name', 'email', 'phoneNumber', 'address'].map((field) => (
              <TextField
                key={field}
                fullWidth
                name={field}
                label={field === 'phoneNumber' ? 'Contact Number' :
                  field === 'name' ? 'Vendor Name' :
                  field.charAt(0).toUpperCase() + field.slice(1)}
                type={field === 'email' ? 'email' : field === 'phoneNumber' ? 'tel' : 'text'}
                value={form[field]}
                onChange={handleChange}
                margin="normal"
                error={Boolean(errors[field])}
                helperText={errors[field]}
              />
            ))}

            <Box mt={2} mb={2}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Vendor Image
                <input hidden accept="image/*" type="file" onChange={handleImageChange} />
              </Button>

              {form.imageUrl && (
                <Box mt={2} display="flex" justifyContent="center">
                  <Avatar
                    src={form.imageUrl}
                    alt="Vendor Preview"
                    sx={{ width: "100%", height: 150, borderRadius: 0 }}
                    variant="rounded"
                  />
                </Box>
              )}
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={submitHandler}
              sx={{ mt: 2 }}
            >
              {vendor ? "Update Vendor" : "Add Vendor"}
            </Button>
          </CardContent>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddEditVendorModal;
