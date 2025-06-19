import React, { useState, useEffect } from "react";
import Layout from "../../layout/Layout";
import ApiService from "../../service/ApiService";
import AddEditRiderModal from "./EditRiderModal";
import DeleteRiderModal from "./DeleteRiderModal";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
  Alert,
  Stack,
  Pagination,
} from "@mui/material";

const RiderPage = () => {
  const [riders, setRiders] = useState([]);
  const [allRiders, setAllRiders] = useState([]);
  const [message, setMessage] = useState("");
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [viewAll, setViewAll] = useState(false);

  const itemsPerPage = 10;

  const fetchRiders = async () => {
    try {
      const response = await ApiService.getAllUsers();
      if (response.status === 200) {
        setAllRiders(response.users);
        const total = response.users.length;
        setTotalPages(Math.ceil(total / itemsPerPage));
        const paginated = viewAll
          ? response.users
          : response.users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
        setRiders(paginated);
      }
    } catch (error) {
      showMessage(error.response?.data?.message || "Error fetching riders");
    }
  };

  useEffect(() => {
    fetchRiders();
  }, [currentPage, viewAll]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleAddEdit = (rider = null) => {
    setSelectedRider(rider);
    setAddEditOpen(true);
  };

  const handleDeleteConfirm = (riderId) => {
    setSelectedRider({ id: riderId });
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await ApiService.deleteUser(selectedRider.id);
      showMessage("Rider deleted successfully");
      const updated = allRiders.filter((r) => r.id !== selectedRider.id);
      setAllRiders(updated);
      setRiders(viewAll ? updated : updated.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    } catch (error) {
      showMessage(error.response?.data?.message || "Error deleting rider");
    } finally {
      setDeleteOpen(false);
    }
  };

  const toggleViewAll = () => {
    if (viewAll) {
      setCurrentPage(1);
    }
    setViewAll(!viewAll);
  };

  return (
    <Layout>
      <Box
        sx={{
          px: 3,
          py: 3,
          filter: addEditOpen || deleteOpen ? "blur(4px)" : "none",
          transition: "filter 0.3s ease",
        }}
      >
        {message && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {message}
          </Alert>
          
        )}
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Typography variant="h4" component="h1">
            Riders
          </Typography>
          <Button variant="outlined" onClick={toggleViewAll}>
            {viewAll ? "View Less" : "View All"}
          </Button>
        </Box>

        <Grid container spacing={3}>
          {riders.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ m: 2 }}>
              No riders found.
            </Typography>
          ) : (
            riders.map((rider) => (
              <Grid item key={rider.id} xs={12} sm={6} md={4} lg={2.4} sx={{ display: "flex" }}>
                <Card sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
                  <Card sx={{ padding: 2, display: "flex", background: "#5EB3F6", justifyContent: "center" }}>
                    <CardMedia
                      component="img"
                      image={rider.imageUrl || "/profile.png"}
                      alt={rider.name}
                      sx={{
                        height: 100,
                        width: 100,
                        objectFit: "cover",
                        borderRadius: "50%",
                        flexShrink: 0,
                      }}
                    />
                  </Card>

                  <CardContent sx={{ flexGrow: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <Typography variant="h6" gutterBottom noWrap>
                      {rider.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textOverflow: "ellipsis", overflow: "hidden" }}>
                      {rider.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textOverflow: "ellipsis", overflow: "hidden" }}>
                      +94 {rider.phoneNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textOverflow: "ellipsis", overflow: "hidden" }}>
                      {rider.role}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ justifyContent: "flex-end", mt: "auto" }}>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="outlined" onClick={() => handleAddEdit(rider)}>
                        Edit
                      </Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteConfirm(rider.id)}>
                        Delete
                      </Button>
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {!viewAll && (
          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, value) => setCurrentPage(value)}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>

      <AddEditRiderModal
        open={addEditOpen}
        handleClose={() => setAddEditOpen(false)}
        rider={selectedRider}
        onSubmit={(wasEdit) => {
          setAddEditOpen(false);
          fetchRiders();
          showMessage(wasEdit ? "Rider updated" : "Rider added");
        }}
      />

      <DeleteRiderModal
        open={deleteOpen}
        handleClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </Layout>
  );
};

export default RiderPage;