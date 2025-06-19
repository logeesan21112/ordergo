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

const EditRiderModal = ({ open, handleClose, rider, onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    phoneNumber: '',
    imageFile: null,
    imageUrl: '',
  });

  useEffect(() => {
    setForm({
      name: rider?.name || '',
      email: rider?.email || '',
      role: rider?.role || '',
      phoneNumber: rider?.phoneNumber || '',
      imageFile: null,
      imageUrl: rider?.imageUrl || '',
    });
  }, [rider]);

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

  const submitHandler = async () => {
    try {
      const formData = new FormData();
      if (rider?.id) formData.append("userId", rider.id);
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("role", form.role);
      formData.append("phoneNumber", form.phoneNumber);
      if (form.imageFile) formData.append("imageFile", form.imageFile);

      const isEditing = Boolean(rider?.id);
      if (isEditing) {
        await ApiService.updateUser(rider.id, formData);
      }

      onSubmit(isEditing);
      handleClose();
    } catch (error) {
      console.error("Failed to save rider", error);
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
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
              {rider ? "Edit Rider" : "Add Rider"}
            </Typography>

            <TextField
              fullWidth
              name="name"
              label="Rider Name"
              value={form.name}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              disabled={Boolean(rider)}
              margin="normal"
            />

            <TextField
              fullWidth
              name="phoneNumber"
              label="Contact Number"
              type="tel"
              value={form.phoneNumber}
              onChange={handleChange}
              margin="normal"
              required
            />

            <Box mt={2} mb={2}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Rider Image
                <input hidden accept="image/*" type="file" onChange={handleImageChange} />
              </Button>

              {form.imageUrl && (
                <Box mt={2} display="flex" justifyContent="center">
                  <Avatar
                    src={form.imageUrl}
                    alt="Rider Preview"
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
              {rider ? "Update Rider" : "Add Rider"}
            </Button>
          </CardContent>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EditRiderModal;