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
  const { newsFeeds, addNewsFeed, updateNewsFeed, deleteNewsFeed } =
    useNewsFeed();
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
  };

  const handleUpdateOpen = (newsFeed: NewsFeed) => {
    setIsUpdate(true);
    setCurrentNewsFeed(newsFeed);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentNewsFeed({ ...currentNewsFeed, [name]: value });
  };

  const handleSave = async () => {
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
      <Container maxWidth="lg" sx={{ marginTop: 5,  
                backgroundImage: `url('https://cbx-prod.b-cdn.net/COLOURBOX35608273.jpg?width=800&height=800&quality=70')`, // Replace with actual image path
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100vh", // Ensures the background covers the whole viewport
                padding: "20px", // Add padding around the content
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
        <TableContainer component={Paper} sx={{ 
            marginBottom: 5, 
            backgroundColor: "rgba(255, 255, 255, 0.5)", // Adjust the last value (0.5) for transparency
            backdropFilter: 'blur(5px)' // Optional: adds a blur effect to the background
            }}>
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
                  <TableCell><img 
                  src={`/images/${newsFeed.image}`} 
                  alt={newsFeed.image} 
                  className="w-auto h-6 mx-auto object-cover" 
                /></TableCell>
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
                <TableCell><img 
                  src={`/images/${newsFeed.image}`} 
                  alt={newsFeed.image} 
                  className="w-auto h-6 mx-auto object-cover" 
                /></TableCell>
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
          <h2>{isUpdate ? "Update News Feed" : "Add News Feed"}</h2>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Item ID"
              name="itemId"
              value={currentNewsFeed.itemId}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            {/* <TextField
            label="Photo URL"
            name="photo"
            value={currentNewsFeed.photo}
            onChange={handleChange}
            fullWidth
            margin="normal"
          /> */}
            <TextField
              label="Discount"
              name="discount"
              value={currentNewsFeed.discount}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={currentNewsFeed.description}
              onChange={handleChange}
              multiline
              rows={5}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Image"
              name="image"
              value={currentNewsFeed.image}
              onChange={handleChange}
              multiline
              rows={5}
              fullWidth
              margin="normal"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="contained" color="inherit" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default NewsFeedScreen;
