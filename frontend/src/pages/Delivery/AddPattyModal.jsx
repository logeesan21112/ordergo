import React, { useState, useEffect } from "react";
import {
  Modal, Box, Typography, TextField, Select, MenuItem,
  InputLabel, FormControl, Button, Alert, Backdrop, Fade, CardContent,
} from "@mui/material";
import ApiService from "../../service/ApiService";

const AddPettyCashModal = ({ open, onClose }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    pettyCash: "",
  });
  const [message, setMessage] = useState("");

  const isAdmin = ApiService.isAdmin();

  useEffect(() => {
    if (!open) return;

    const fetchUsers = async () => {
      try {
        if (isAdmin) {
          const { users } = await ApiService.getAllUsers();
          setUsers(users);
        } else {
          const user = await ApiService.getLoggedInUserInfo();
          setFormData((prev) => ({ ...prev, userId: user.id, userName: user.name }));
        }
      } catch (error) {
        showMessage(error.response?.data?.message || "Error getting users");
      }
    };

    fetchUsers();
  }, [isAdmin, open]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userId || !formData.pettyCash) {
      showMessage("Please select a user and enter the amount.");
      return;
    }

    try {
      await ApiService.addPettyCash({
        userId: formData.userId,
        pettyCash: parseFloat(formData.pettyCash),
      });

      showMessage("Petty cash recorded successfully");
      setFormData((prev) => ({ ...prev, pettyCash: "" }));
      setTimeout(onClose, 1000);
    } catch (error) {
      showMessage(error.response?.data?.message || "Error recording petty cash");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
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
              Add Petty Cash
            </Typography>

            {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

            {isAdmin ? (
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Rider</InputLabel>
                <Select
                  value={formData.userId}
                  label="Rider"
                  onChange={(e) => setFormData((prev) => ({ ...prev, userId: e.target.value }))}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField fullWidth label="Rider" value={formData.userName} disabled margin="normal" />
            )}

            <TextField
              fullWidth
              label="Petty Cash Amount"
              type="number"
              name="pettyCash"
              value={formData.pettyCash}
              onChange={handleChange}
              required
              inputProps={{ min: 1, step: 0.01 }}
              margin="normal"
            />

            <Box mt={2} display="flex" justifyContent="space-between">
              <Button variant="outlined" onClick={onClose}>Cancel</Button>
              <Button variant="contained" onClick={handleSubmit} color="primary">
                Add Petty Cash
              </Button>
            </Box>
          </CardContent>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddPettyCashModal;