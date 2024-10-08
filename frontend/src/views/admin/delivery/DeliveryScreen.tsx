import React, { useState, useMemo } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Modal,
  Box,
  TextField,
  MenuItem,
  Select,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select"; // Import SelectChangeEvent type
import { useDelivery } from "../../../hooks/useDelivery";
import { Delivery } from "../../../context/deliveryContext";

const DeliveryScreen = () => {
  const { deliveries, addDelivery, updateDelivery, deleteDelivery } =
    useDelivery();
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDelivery, setCurrentDelivery] = useState({
    _id: "",
    name: "",
    mobile: "",
    vehicleId: "",
    category: "",
    orderStatus: "",
    nic: "",
    email: "",
    image: "",
    address: "",
    // assignedOrders: [] as string[],
  });

   // Error states
   const [errors, setErrors] = useState({
    name: "",
    mobile: "",
    vehicleId: "",
    nic: "",
    email: "",
    address: ""
  });


  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(
      (delivery) =>
        delivery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.orderStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.nic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [deliveries, searchTerm]);

  const handleOpen = () => {
    setIsUpdate(false);
    setCurrentDelivery({
      _id: "",
      name: "",
      mobile: "",
      vehicleId: "",
      category: "",
      orderStatus: "",
      nic: "",
      email: "",
      image: "",
      address: "",
      // assignedOrders: [] as string[],
    });
    setErrors({ name: "", mobile: "", vehicleId: "" , address:"", nic: "",email: ""});
    setOpen(true);
  };

  const handleUpdateOpen = (delivery: Delivery) => {
    setIsUpdate(true);
    setCurrentDelivery({
      _id: delivery._id || "",
      name: delivery.name,
      mobile: delivery.mobile,
      vehicleId: delivery.vehicleId,
      category: delivery.category,
      orderStatus: delivery.orderStatus,
      nic: delivery.nic || "",
      email: delivery.email || "",
      image: delivery.image || "",
      address: delivery.address || "",
      // assignedOrders: delivery.assignedOrders || [],
    });
    setErrors({ name: "", mobile: "", vehicleId: "" , address:"", nic: "",email: ""});
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentDelivery({ ...currentDelivery, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setCurrentDelivery({ ...currentDelivery, [name]: value });
  };

  const validateFields = () => {
    let valid = true;
    const newErrors = { name: "", mobile: "", vehicleId: "" , address:"", nic: "",email: "" };

    // Validate name
    if (!/^[A-Za-z\s]+$/.test(currentDelivery.name)) {
      newErrors.name = "Invalid Name, Please Enter Again!";
      valid = false;
    }
    //address
    if (!/^\d+\s*,\s*[A-Za-z\s]+,\s*[A-Za-z\s]+$/.test(currentDelivery.address)) {
      newErrors.address = "Add the correct format of an address";
      valid = false;
    }

    // Validate mobile
    if (!/^0\d{9}$/.test(currentDelivery.mobile)) {
      newErrors.mobile = "Mobile must contain 10 digits and start with '0'.";
      valid = false;
    }

    // Validate vehicleId
    if (!/^[A-Za-z]{2}\d{4}$/.test(currentDelivery.vehicleId)) {
      newErrors.vehicleId =
        "Vehicle ID must start with two letters followed by four numbers.";
      valid = false;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(currentDelivery.email)) {
      newErrors.email =
        "Invalid Email,Please Enter Again!";
      valid = false;
    }

    if (!/^(\d{12}|\d{9}[vV])$/.test(currentDelivery.nic)) {
      newErrors.nic =
        "Invalid NIC, Please Enter Again!";
      valid = false;
    }

    // Check for unique name
    const isNameUnique = !deliveries.some(
      (delivery) =>
        delivery.name.toLowerCase() === currentDelivery.name.toLowerCase() &&
        delivery._id !== currentDelivery._id // Exclude current delivery if updating
    );
    if (!isNameUnique) {
      newErrors.name = "Delivery name must be unique.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };


  const handleSave = async () => {

    if (!validateFields()) {
      return; // If validation fails, stop the save process
    }
    const { _id, ...currentDeliveryWithoutId } = currentDelivery;
    if (isUpdate) {
      if (await updateDelivery({ _id, ...currentDeliveryWithoutId })) {
        handleClose();
      } else {
        alert("Failed to update delivery");
      }
    } else {
      if (await addDelivery(currentDeliveryWithoutId)) {
        handleClose();
      } else {
        alert("Failed to add delivery");
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Container maxWidth="lg" sx={{
        mt: 2,
        mb: 2,
        backgroundImage: 'url("https://darvideo.tv/wp-content/uploads/2021/05/Logistics-explainer-Videos-1-1.jpg")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
      }} className="no-print">
        <Paper
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 5,
            backgroundColor: "inherit",
            border: "none",
            boxShadow: "none",
          }}
        >
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add Delivery Drivers
          </Button>
          <TextField
            label="Search deliveries"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: "300px" }}
          />
          <Button variant="contained" color="inherit" onClick={handlePrint}>
            Print Report
          </Button>
        </Paper>
        <TableContainer component={Paper} sx={{ 
            marginBottom: 5, 
            backgroundColor: "rgba(255, 255, 255, 0.5)", // Adjust the last value (0.5) for transparency
            backdropFilter: 'blur(5px)' // Optional: adds a blur effect to the background
            }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact No</TableCell>
                <TableCell>Vehicle No</TableCell>
                <TableCell>NIC</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Current Status</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Image</TableCell>
                <TableCell className="no-print">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDeliveries.map((delivery) => (
                <TableRow key={delivery._id}>
                  <TableCell>{delivery.name}</TableCell>
                  <TableCell>{delivery.mobile}</TableCell>
                  <TableCell>{delivery.vehicleId}</TableCell>
                  <TableCell>{delivery.nic}</TableCell>
                  <TableCell>{delivery.email}</TableCell>
                  <TableCell>{delivery.category}</TableCell>
                  <TableCell>{delivery.orderStatus}</TableCell>
                  <TableCell>{delivery.address}</TableCell>
                  <TableCell>
                    <img
                      src={`/drivers/${delivery.image}`}
                      // alt={delivery.name}
                      style={{ width: "90px", height: "70px", borderRadius: "10%" }}
                    />
                  </TableCell>
                  <TableCell
                    className="no-print"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "stretch",
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateOpen(delivery)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "red" }}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this delivery?"
                          )
                        ) {
                          deleteDelivery(delivery._id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <div className="print-only">
        <Typography variant="h5" gutterBottom>
          Delivery Report
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact No</TableCell>
              <TableCell>Vehicle No</TableCell>
              <TableCell>NIC</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Current Status</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDeliveries.map((delivery) => (
              <TableRow key={delivery._id}>
                <TableCell>{delivery.name}</TableCell>
                <TableCell>{delivery.mobile}</TableCell>
                <TableCell>{delivery.vehicleId}</TableCell>
                <TableCell>{delivery.nic}</TableCell>
                <TableCell>{delivery.email}</TableCell>
                <TableCell>{delivery.category}</TableCell>
                <TableCell>{delivery.orderStatus}</TableCell>
                <TableCell>{delivery.address}</TableCell>
                <TableCell>
                  <img
                    src={`/drivers/${delivery.image}`}
                    // alt={delivery.name}
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>{isUpdate ? "Update Delivery" : "Add Delivery"}</h2>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={currentDelivery.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contact No"
              name="mobile"
              value={currentDelivery.mobile}
              onChange={handleChange}
              error={Boolean(errors.mobile)}
              helperText={errors.mobile}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Vehicle No"
              name="vehicleId"
              value={currentDelivery.vehicleId}
              onChange={handleChange}
              error={Boolean(errors.vehicleId)}
              helperText={errors.vehicleId}
              fullWidth
              margin="normal"
            />
            <TextField
              label="NIC"
              name="nic"
              value={currentDelivery.nic}
              onChange={handleChange}
              error={Boolean(errors.nic)}
              helperText={errors.nic}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={currentDelivery.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Address"
              name="address"
              value={currentDelivery.address}
              onChange={handleChange}
              error={Boolean(errors.address)}
              helperText={errors.address}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={currentDelivery.category}
                onChange={handleSelectChange} // Use the new handleSelectChange
              >
                <MenuItem value="truck">truck</MenuItem>
                <MenuItem value="Car">car</MenuItem>
                <MenuItem value="bike">bike</MenuItem>
                {/* Add more categories as needed */}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="order-status-label">Current Status</InputLabel>
              <Select
                labelId="order-status-label"
                name="orderStatus"
                value={currentDelivery.orderStatus}
                onChange={handleSelectChange} // Use the new handleSelectChange
              >
                <MenuItem value="Pending">Available</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="In Transit">Out To Delivery</MenuItem>
                {/* Add more statuses as needed */}
              </Select>
            </FormControl>
            <TextField
              label="Image URL"
              name="image"
              value={currentDelivery.image}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ mt: 2 }}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default DeliveryScreen;
