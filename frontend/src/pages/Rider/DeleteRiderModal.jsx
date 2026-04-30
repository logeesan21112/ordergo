import React from "react";
import { Modal, Box, Typography, Button, Backdrop, Fade, Stack } from "@mui/material";

const DeleteRiderModal = ({ open, handleClose, onConfirm }) => (
  <Modal open={open} onClose={handleClose} closeAfterTransition
    BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
    <Fade in={open}>
      <Box sx={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 300, bgcolor: "background.paper",
        p: 4, borderRadius: 2, textAlign: "center",
      }}>
        <Typography variant="body1" mb={3}>
          Are you sure you want to delete this rider?
        </Typography>
        <Stack spacing={2} direction="row" justifyContent="center">
          <Button variant="outlined" onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="error" onClick={onConfirm}>Delete</Button>
        </Stack>
      </Box>
    </Fade>
  </Modal>
);

export default DeleteRiderModal;