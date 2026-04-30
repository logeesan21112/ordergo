import React, { useState, useEffect } from "react";
import Layout from "../../layout/Layout";
import ApiService from "../../service/ApiService";
import AddEditVendorModal from "./AddEditVendorModal";
import DeleteVendorModal from "./DeleteVendorModal";
import {
  Box, Typography, Button, Card, CardContent,
  CardActions, Grid, Alert, Stack, Pagination, Avatar,
} from "@mui/material";

const VendorPage = () => {
  const [vendors, setVendors] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [message, setMessage] = useState("");
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(allVendors.length / itemsPerPage);

  const fetchVendors = async () => {
    try {
      const { status, vendors: vendorData } = await ApiService.getAllVendors();
      if (status === 200) {
        setAllVendors(vendorData);
        setVendors(viewAll
          ? vendorData
          : vendorData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        );
      }
    } catch (error) {
      showMessage(error.response?.data?.message || "Error fetching vendors");
    }
  };

  useEffect(() => { fetchVendors(); }, [currentPage, viewAll]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const confirmDelete = async () => {
    try {
      await ApiService.deleteVendor(selectedVendor.id);
      showMessage("Vendor deleted successfully");
      const updated = allVendors.filter((v) => v.id !== selectedVendor.id);
      setAllVendors(updated);
      setVendors(viewAll ? updated : updated.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    } catch (error) {
      showMessage(error.response?.data?.message || "Error deleting vendor");
    } finally {
      setDeleteOpen(false);
    }
  };

  return (
    <Layout>
      <Box sx={{
        px: 3, py: 3,
        filter: addEditOpen || deleteOpen ? "blur(4px)" : "none",
        transition: "filter 0.3s ease",
      }}>
        {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={2}>
          <Typography variant="h4">Vendors</Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => setViewAll((prev) => !prev)}>
              {viewAll ? "View Less" : "View All"}
            </Button>
            {ApiService.getRole() === "ADMIN" && (
              <Button variant="contained" onClick={() => { setSelectedVendor(null); setAddEditOpen(true); }}>
                Add Vendor
              </Button>
            )}
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {vendors.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ m: 2 }}>
              No vendors found.
            </Typography>
          ) : (
            vendors.map((vendor) => (
              <Grid item key={vendor.id} xs={12} sm={6} md={4} lg={2.4} sx={{ display: "flex" }}>
                <Card sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
                  <Card sx={{ p: 2, display: "flex", background: "#5EB3F6", justifyContent: "center" }}>
                    <Avatar
                      src={vendor.imageUrl ? `/${vendor.imageUrl}` : ""}
                      alt={vendor.name}
                      sx={{
                        width: 100,
                        height: 100,
                        fontSize: 40,
                        bgcolor: "#1976d2",
                      }}
                    >
                      {!vendor.imageUrl && vendor.name
                        ? vendor.name.charAt(0).toUpperCase()
                        : null}
                    </Avatar>
                  </Card>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom noWrap>{vendor.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{vendor.email}</Typography>
                    <Typography variant="body2" color="text.secondary">+94 {vendor.phoneNumber}</Typography>
                  </CardContent>

                  {ApiService.getRole() === "ADMIN" && (
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" variant="outlined"
                          onClick={() => { setSelectedVendor(vendor); setAddEditOpen(true); }}>
                          Edit
                        </Button>
                        <Button size="small" variant="outlined" color="error"
                          onClick={() => { setSelectedVendor({ id: vendor.id }); setDeleteOpen(true); }}>
                          Delete
                        </Button>
                      </Stack>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {!viewAll && (
          <Box mt={3} display="flex" justifyContent="center">
            <Pagination count={totalPages} page={currentPage}
              onChange={(_, value) => setCurrentPage(value)}
              color="primary" showFirstButton showLastButton />
          </Box>
        )}
      </Box>

      <AddEditVendorModal
        open={addEditOpen}
        handleClose={() => setAddEditOpen(false)}
        vendor={selectedVendor}
        onSubmit={(wasEdit) => {
          setAddEditOpen(false);
          fetchVendors();
          showMessage(wasEdit ? "Vendor updated" : "Vendor added");
        }}
      />

      <DeleteVendorModal
        open={deleteOpen}
        handleClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </Layout>
  );
};

export default VendorPage;