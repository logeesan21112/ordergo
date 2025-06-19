import React from "react";
import { Modal, Box, Typography, Button, Fade, Backdrop } from "@mui/material";

const DeleteExpenseModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  message = "Are you sure to delete?" 
}) => (
  <Modal
    open={open}
    onClose={onClose}
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
        width: 300,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 24,
        p: 3,
        textAlign: "center",
      }}>
        <Typography variant="h6" mb={2}>{message}</Typography>
        <Box display="flex" justifyContent="space-around" mt={3}>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="error" onClick={onConfirm}>Delete</Button>
        </Box>
      </Box>
    </Fade>
  </Modal>
);

export default DeleteExpenseModal;