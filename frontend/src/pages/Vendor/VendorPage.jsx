import React, { useState, useEffect } from "react";
import Layout from "../../layout/Layout";
import ApiService from "../../service/ApiService";
import AddEditVendorModal from "./AddEditVendorModal";
import DeleteVendorModal from "./DeleteVendorModal";
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

const VendorPage = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);

  const fetchVendors = async () => {
    try {
      const { status, products: productData } = await ApiService.getAllProducts();
      if (status === 200) {
        setAllProducts(productData);
        updateDisplayedProducts(productData);
      }
    } catch (error) {
      showMessage(error.response?.data?.message || "Error fetching vendors");
    }
  };

  const updateDisplayedProducts = (products) => {
    setProducts(viewAll 
      ? products 
      : products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    );
  };

  useEffect(() => {
    fetchVendors();
  }, [currentPage, viewAll]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleAddEdit = (vendor = null) => {
    setSelectedVendor(vendor);
    setAddEditOpen(true);
  };

  const handleDeleteConfirm = (vendorId) => {
    setSelectedVendor({ id: vendorId });
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await ApiService.deleteProduct(selectedVendor.id);
      showMessage("Vendor successfully deleted");
      const updatedProducts = allProducts.filter(p => p.id !== selectedVendor.id);
      setAllProducts(updatedProducts);
      updateDisplayedProducts(updatedProducts);
    } catch (error) {
      showMessage(error.response?.data?.message || "Error deleting vendor");
    } finally {
      setDeleteOpen(false);
    }
  };

  const toggleViewAll = () => {
    setViewAll(prev => {
      if (!prev) setCurrentPage(1);
      return !prev;
    });
  };

  return (
    <Layout>
      <Box sx={{
        px: 3,
        py: 3,
        filter: addEditOpen || deleteOpen ? "blur(4px)" : "none",
        transition: "filter 0.3s ease",
      }}>
        {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={2}>
          <Typography variant="h4" component="h1">Vendors</Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={toggleViewAll}>
              {viewAll ? "View Less" : "View All"}
            </Button>
            {ApiService.getRole() === "ADMIN" && (
              <Button variant="contained" onClick={() => handleAddEdit()}>
                Add Vendor
              </Button>
            )}
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {products.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ m: 2 }}>
              No vendors found.
            </Typography>
          ) : (
            products.map(product => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={2.4} sx={{ display: "flex" }}>
                <Card sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
                  <Card sx={{ p: 2, display: "flex", background: "#5EB3F6", justifyContent: "center" }}>
                    <CardMedia
                      component="img"
                      image={product.imageUrl || "/profile.png"}
                      alt={product.name}
                      sx={{ height: 100, width: 100, objectFit: "cover", borderRadius: "50%" }}
                    />
                  </Card>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom noWrap>{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {product.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      +94 {product.phoneNumber}
                    </Typography>
                  </CardContent>

                  {ApiService.getRole() === "ADMIN" && (
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" variant="outlined" onClick={() => handleAddEdit(product)}>
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteConfirm(product.id)}
                        >
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