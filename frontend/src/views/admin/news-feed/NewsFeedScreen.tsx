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
  Typography,
} from "@mui/material";
import { useNewsFeed } from "../../../hooks/useNewsFeed";
import { NewsFeed } from "../../../context/newsFeedContext";

const NewsFeedScreen = () => {
  const { newsFeeds, addNewsFeed, updateNewsFeed, deleteNewsFeed } = useNewsFeed();
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentNewsFeed, setCurrentNewsFeed] = useState({
    _id: "",
    itemId: "",
    discount: "",
    description: "",
    image: "",
  });

  // Error messages
  const [errorMessages, setErrorMessages] = useState({
    itemId: "",
    discount: "",
    description: "",
  });
  const [showErrorBox, setShowErrorBox] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Filter news feeds based on search term
  const filteredNewsFeeds = useMemo(() => {
    return newsFeeds.filter(
      (newsFeed) =>
        newsFeed.itemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        newsFeed.discount.toString().includes(searchTerm) ||
        newsFeed.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [newsFeeds, searchTerm]);

  const handleOpen = () => {
    setIsUpdate(false);
    setCurrentNewsFeed({
      _id: "",
      itemId: "",
      image: "",
      discount: "",
      description: "",
    });
    setOpen(true);
    setErrorMessages({ itemId: "", discount: "", description: "" }); // Reset error messages
    setShowErrorBox(false); // Hide error box
    setErrorMessage(""); // Clear error message
  };

  const handleUpdateOpen = (newsFeed: NewsFeed) => {
    setIsUpdate(true);
    setCurrentNewsFeed(newsFeed);
    setOpen(true);
    setErrorMessages({ itemId: "", discount: "", description: "" }); // Reset error messages
    setShowErrorBox(false); // Hide error box
    setErrorMessage(""); // Clear error message
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentNewsFeed({ ...currentNewsFeed, [name]: value });
  };

  const handleSave = async () => {
    const discountValue = parseFloat(currentNewsFeed.discount);
    const descriptionValue = currentNewsFeed.description;
    const itemIdValue = currentNewsFeed.itemId;

    // Reset error messages
    setErrorMessages({ itemId: "", discount: "", description: "" });
    setShowErrorBox(false); // Hide error box
    setErrorMessage(""); // Clear error message

    // Check if all fields are filled out
    if (!itemIdValue || !discountValue || !descriptionValue || !currentNewsFeed.image) {
      setShowErrorBox(true);
      setErrorMessage("All fields must be filled out.");
      return;
    }

    // Validate Item ID uniqueness
    const isDuplicate = newsFeeds.some(
      (newsFeed) => newsFeed.itemId === itemIdValue && newsFeed._id !== currentNewsFeed._id
    );

    if (isDuplicate) {
      setErrorMessages((prev) => ({
        ...prev,
        itemId: "Item ID must be unique.",
      }));
      return;
    }

    // Validate discount
    if (isNaN(discountValue) || discountValue < 0.1 || discountValue > 100) {
      setErrorMessages((prev) => ({
        ...prev,
        discount: "Discount must be a number between 0.1 and 100.",
      }));
      return;
    }

    // Validate description
    if (descriptionValue.length > 50) {
      setErrorMessages((prev) => ({
        ...prev,
        description: "Description cannot exceed 50 characters.",
      }));
      return;
    }

    if (isUpdate) {
      if (await updateNewsFeed(currentNewsFeed)) {
        alert("News Feed updated successfully");
        handleClose();
      } else {
        alert("Failed to update news feed");
      }
    } else {
      if (await addNewsFeed(currentNewsFeed)) {
        alert("News Feed added successfully");
        handleClose();
      } else {
        alert("Failed to add news feed");
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          marginTop: 5,
          backgroundImage: `url('https://cbx-prod.b-cdn.net/COLOURBOX35608273.jpg?width=800&height=800&quality=70')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          padding: "20px",
        }}
        className="no-print"
      >
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
            Add News Feed
          </Button>
          <TextField
            label="Search news feeds"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: "300px" }}
          />
          <Button variant="contained" color="inherit" onClick={handlePrint}>
            Print Report
          </Button>
        </Paper>
        <TableContainer
          component={Paper}
          sx={{
            marginBottom: 5,
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(5px)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Image</TableCell>
                <TableCell className="no-print">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNewsFeeds.map((newsFeed) => (
                <TableRow key={newsFeed._id}>
                  <TableCell>{newsFeed.itemId}</TableCell>
                  <TableCell>{newsFeed.discount}</TableCell>
                  <TableCell>{newsFeed.description}</TableCell>
                  <TableCell>
                    <img
                      src={`/images/${newsFeed.image}`}
                      alt={newsFeed.image}
                      className="w-auto h-6 mx-auto object-cover"
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
                      onClick={() => handleUpdateOpen(newsFeed)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "red" }}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this news feed?"
                          )
                        ) {
                          deleteNewsFeed(newsFeed._id);
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

      {/* Printable table */}
      <div className="print-only">
        <Typography variant="h5" gutterBottom>
          News Feed Report
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredNewsFeeds.map((newsFeed) => (
              <TableRow key={newsFeed._id}>
                <TableCell>{newsFeed.itemId}</TableCell>
                <TableCell>{newsFeed.discount}</TableCell>
                <TableCell>{newsFeed.description}</TableCell>
                <TableCell>
                  <img
                    src={`/images/${newsFeed.image}`}
                    alt={newsFeed.image}
                    className="w-auto h-6 mx-auto object-cover"
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
          <Typography variant="h6" gutterBottom>
            {isUpdate ? "Update News Feed" : "Add News Feed"}
          </Typography>
          {showErrorBox && (
            <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>
          )}
          <TextField
            label="Item ID"
            name="itemId"
            variant="outlined"
            fullWidth
            value={currentNewsFeed.itemId}
            onChange={handleChange}
            error={!!errorMessages.itemId}
            helperText={errorMessages.itemId}
            margin="normal"
          />
          <TextField
            label="Discount"
            name="discount"
            variant="outlined"
            fullWidth
            type="number"
            value={currentNewsFeed.discount}
            onChange={handleChange}
            error={!!errorMessages.discount}
            helperText={errorMessages.discount}
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            variant="outlined"
            fullWidth
            value={currentNewsFeed.description}
            onChange={handleChange}
            error={!!errorMessages.description}
            helperText={errorMessages.description}
            margin="normal"
          />
          <TextField
            label="Image"
            name="image"
            variant="outlined"
            fullWidth
            value={currentNewsFeed.image}
            onChange={handleChange}
            margin="normal"
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 3 }}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginLeft: 2 }}>
              {isUpdate ? "Update" : "Add"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default NewsFeedScreen;
