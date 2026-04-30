import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import Select from "react-select";
import {
  Box, Button, CardContent, Checkbox, Modal, Backdrop, Fade,
  FormControlLabel, MenuItem, Radio, TextField, Typography,
} from "@mui/material";

const AddEditDeliveryModal = ({ open, onClose, editData, onSave}) => {
  const [incomeType, setIncomeType] = useState("");
  const [paymentType, setPaymentType] = useState([]);
  const [cardOrOnlinePayment, setCardOrOnlinePayment] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [vendors, setVendors] = useState([]);
  const [vendorId, setVendorId] = useState("");
  const [description, setDescription] = useState("");
  const [locationUrl, setLocationUrl] = useState("Getting location...");
  const [deliveryCharge, setDeliveryCharge] = useState("");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = ApiService.isAdmin();
  const isEditMode = Boolean(editData);

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      minHeight: 40,
      fontSize: "1rem",
      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      backgroundColor: "#fff",
      boxShadow:
        "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? "rgba(0, 0, 0, 0.04)" : "#fff",
      color: "#000",
      fontSize: "0.875rem",
      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
      "&:active": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
    }),
    singleValue: (base) => ({ ...base, color: "rgba(0, 0, 0, 0.87)", fontSize: "1rem" }),
    placeholder: (base) => ({ ...base, color: "rgba(0, 0, 0, 0.6)", fontSize: "1rem" }),
  };

  useEffect(() => {
    if (editData) {
      setVendorId(editData.vendorId);
      setDeliveryCharge(editData.deliveryCharge.toString());
      setIncomeType(editData.incomeType.replaceAll(" ", "_"));
      setPaymentType(editData.paymentType.split(" AND ").map((t) => t.replaceAll(" ", "_")));
      setPaymentStatus(editData.paymentStatus.replaceAll(" ", "_"));
      setCardOrOnlinePayment(editData.cardOrOnlinePayment.toString());
      setDescription(editData.description || "");
      setLocationUrl(editData.location);
      setUserId(editData.userId);
    } else {
      setIncomeType("");
      setPaymentType([]);
      setCardOrOnlinePayment("");
      setPaymentStatus("");
      setVendorId("");
      setDescription("");
      setDeliveryCharge("");
      setMessage("");

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude, longitude } = pos.coords;
          setLocationUrl(`https://www.google.com/maps?q=${latitude},${longitude}`);
        });
      }
    }
  }, [editData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorRes = await ApiService.getAllVendors();
        setVendors(vendorRes.vendors);

        if (isAdmin) {
          const userRes = await ApiService.getAllUsers();
          setUsers(userRes.users);
        } else {
          const user = await ApiService.getLoggedInUserInfo();
          setUserId(user.id);
          setUserName(user.name);
        }
      } catch (error) {
        setMessage("Error loading data");
      }
    };

    if (open) fetchData();
  }, [open, isAdmin]);

  const handleCheckboxChange = (e) => {
    const value = e.target.name;
    setPaymentType((prev) =>
      e.target.checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      userId,
      vendorId: parseInt(vendorId),
      deliveryCharge: parseFloat(deliveryCharge),
      cardOrOnlinePayment:
        paymentType.includes("CARD") || paymentType.includes("ONLINE_TRANSFER")
          ? parseFloat(cardOrOnlinePayment || 0)
          : 0,
      incomeType: incomeType.replaceAll("_", " "),
      paymentType: paymentType.map((type) => type.replaceAll("_", " ")).join(" AND "),
      paymentStatus: paymentStatus.replaceAll("_", " "),
      location: locationUrl,
      description,
    };

    try {
      if (isEditMode) {
        await ApiService.updateDelivery(editData.id, payload);
      } else {
        await ApiService.addDelivery(payload);
      }
      if (onSave) onSave();
      else onClose();
    } catch (err) {
      setMessage("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      sx={{ overflowY: "auto", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "relative",
            width: { xs: "90%", sm: 500 },
            maxHeight: "90vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            overflowY: "auto",
            my: 2,
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
              {isEditMode ? "Edit Delivery" : "New Delivery"}
            </Typography>

            <Box
              sx={{
                maxHeight: "calc(90vh - 150px)",
                overflowY: "auto",
                pr: 1,
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {isAdmin ? (
                <TextField
                  label="Rider"
                  select
                  fullWidth
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  margin="normal"
                >
                  {users.map((u) => (
                    <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField label="Rider" fullWidth value={userName} margin="normal" disabled />
              )}

              <Typography fontWeight={500} mt={2}>Income Type</Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                {["DELIVERYCHARGE", "COMMISSION", "TIPS"].map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={<Radio checked={incomeType === type} onChange={() => setIncomeType(type)} />}
                    label={type}
                  />
                ))}
              </Box>

              <Typography fontWeight={500} mt={2}>Payment Type</Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                {["CASH", "CARD", "ONLINE_TRANSFER"].map((type) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        checked={paymentType.includes(type)}
                        onChange={handleCheckboxChange}
                        name={type}
                      />
                    }
                    label={type.replace("_", " ")}
                  />
                ))}
              </Box>

              <TextField
                label="Card or Online Payment Amount"
                type="number"
                fullWidth
                margin="normal"
                value={cardOrOnlinePayment}
                onChange={(e) => setCardOrOnlinePayment(e.target.value)}
                disabled={!paymentType.includes("CARD") && !paymentType.includes("ONLINE_TRANSFER")}
                required={paymentType.includes("CARD") || paymentType.includes("ONLINE_TRANSFER")}
              />

              <TextField
                label="Payment Status"
                select
                fullWidth
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                margin="normal"
              >
                {["COMPLETED", "PENDING", "PROCESSING", "CANCELLED"].map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </TextField>

              <TextField
                label="Delivery Charge"
                type="number"
                fullWidth
                margin="normal"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
              />

              <Box mt={2} mb={2}>
                <Select
                  styles={customSelectStyles}
                  options={vendors.map((v) => ({ value: v.id, label: v.name }))}
                  value={
                    vendors.find((v) => v.id === parseInt(vendorId))
                      ? { value: parseInt(vendorId), label: vendors.find((v) => v.id === parseInt(vendorId)).name }
                      : null
                  }
                  onChange={(opt) => setVendorId(opt ? opt.value : "")}
                  placeholder="Select / Search Vendor"
                  isClearable
                  isSearchable
                />
              </Box>

              <TextField label="Location" fullWidth margin="normal" value={locationUrl} disabled />

              <TextField
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Submitting..." : isEditMode ? "Update" : "Submit"}
            </Button>
          </CardContent>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddEditDeliveryModal;