import React, { useState, useEffect } from "react";
import {
  Box, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel,
  FormControl, 
  Button, 
  Modal, 
  Fade, 
  Backdrop, 
  Alert
} from "@mui/material";
import ApiService from "../../service/ApiService";

const AddEditExpenseModal = ({ open, onClose, expenseToEdit, onSave }) => {
  const [formData, setFormData] = useState({
    userId: "",
    expenseType: "",
    expenseAmount: "",
    description: "",
    userName: ""
  });
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const isAdmin = ApiService.isAdmin();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (isAdmin) {
          const userData = await ApiService.getAllUsers();
          setUsers(userData.users);
        } else {
          const user = await ApiService.getLoggedInUsesInfo();
          setFormData(prev => ({ ...prev, userId: user.id, userName: user.name }));
        }
      } catch (error) {
        showMessage(error.response?.data?.message || "Error getting users");
      }
    };

    fetchUsers();
  }, [isAdmin]);

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        userId: expenseToEdit.userId || "",
        expenseType: expenseToEdit.expenseType || "",
        expenseAmount: expenseToEdit.expenseAmount?.toString() || "",
        description: expenseToEdit.description || "",
        userName: expenseToEdit.userName || ""
      });
    } else {
      setFormData({
        userId: "",
        expenseType: "",
        expenseAmount: "",
        description: "",
        userName: isAdmin ? "" : formData.userName
      });
      setMessage("");
    }
  }, [expenseToEdit, isAdmin]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.expenseType || !formData.expenseAmount) {
      showMessage("Please fill in all required fields.");
      return;
    }

    const payload = {
      userId: formData.userId,
      expenseType: formData.expenseType,
      expenseAmount: parseFloat(formData.expenseAmount),
      description: formData.description
    };

    try {
      if (expenseToEdit) {
        await ApiService.updateCharge(expenseToEdit.id, payload);
        showMessage("Expense updated successfully");
      } else {
        await ApiService.addCharge(payload);
        showMessage("Expense added successfully");
      }
      onSave();
      onClose();
    } catch (error) {
      showMessage(error.response?.data?.message || "Error saving expense");
    }
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
          <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
            {expenseToEdit ? "Edit Expense" : "Add Expense"}
          </Typography>

          {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

          <form onSubmit={handleSubmit}>
            {isAdmin ? (
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Rider</InputLabel>
                <Select
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  label="Rider"
                >
                  <MenuItem value="">-- Select Rider --</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField 
                fullWidth 
                label="Rider" 
                value={formData.userName} 
                margin="normal" 
                disabled 
              />
            )}

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Expense Type</InputLabel>
              <Select
                name="expenseType"
                value={formData.expenseType}
                onChange={handleChange}
                label="Expense Type"
              >
                <MenuItem value="">-- Select Expense Type --</MenuItem>
                <MenuItem value="FUEL_COSTS">Fuel Costs</MenuItem>
                <MenuItem value="VEHICLE_MAINTENANCE">Vehicle Maintenance</MenuItem>
                <MenuItem value="RIDER_WAGES">Rider Wages</MenuItem>
                <MenuItem value="OTHERS">Others</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              name="expenseAmount"
              label="Expense Amount"
              type="number"
              margin="normal"
              required
              inputProps={{ min: 1 }}
              value={formData.expenseAmount}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              name="description"
              label="Description"
              margin="normal"
              value={formData.description}
              onChange={handleChange}
            />

            <Box mt={2} display="flex" justifyContent="space-between">
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {expenseToEdit ? "Update" : "Submit"}
              </Button>
            </Box>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddEditExpenseModal;