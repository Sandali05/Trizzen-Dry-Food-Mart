import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import {
  People as CustomersIcon,
  LocalShipping as DeliveriesIcon,
  Feedback as FeedbackIcon,
  ShoppingCart as OrdersIcon,
  RssFeed as NewsFeedIcon,
  Business as SuppliersIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCustomer } from "../../hooks/useCustomer";
import { useDelivery } from "../../hooks/useDelivery";
import { useOrder } from "../../hooks/useOrder";
import { useFeedback } from "../../hooks/useFeedback";
import { useNewsFeed } from "../../hooks/useNewsFeed";
import { useSupplier } from "../../hooks/useSupplier";
import React, { useState, useEffect } from "react";
import axios from "axios";

const DashboardCard = ({
  title,
  count,
  icon,
  onClick,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  onClick: () => void;
}) => (
  <Paper
    sx={{
      p: 2,
      display: "flex",
      flexDirection: "column",
      height: 140,
      justifyContent: "space-between",
      backgroundColor: "rgba(255, 255, 255, 0.9)", // Optional: Add a semi-transparent background to the card
      cursor: "pointer",
    }}
    onClick={onClick}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography component="h2" variant="h6" color="primary" gutterBottom sx={{ fontWeight: "bold"}}>
        {title}
      </Typography>
      {icon}
    </Box>
    <Typography component="p" variant="h4" sx={{ fontWeight: "bold"}}>
      {count}
    </Typography>
  </Paper>
);

const AdminDashboardScreen = () => {
  const navigate = useNavigate();
  const { customers } = useCustomer();
  const { deliveries } = useDelivery();
  const { orders } = useOrder();
  const { feedbacks } = useFeedback();
  const { newsFeeds } = useNewsFeed();
  const { suppliers } = useSupplier();

   // State for inventory items
   const [items, setItems] = useState([]);

   // Fetch the items from the backend API
   useEffect(() => {
     const fetchItems = async () => {
       try {
         const response = await axios.get("http://localhost:3000/api/auth/items");
         setItems(response.data);
       } catch (error) {
         console.error("Failed to fetch items:", error);
       }
     };
     fetchItems();
   }, []);

  const dashboardItems = [
    {
      title: "Customers",
      count: customers.length,
      icon: <CustomersIcon />,
      path: "/admindashboard/customers",
    },
    {
      title: "Drivers",
      count: deliveries.length,
      icon: <DeliveriesIcon />,
      path: "/admindashboard/delivery",
    },
    {
      title: "Orders",
      count: orders.length,
      icon: <OrdersIcon />,
      path: "/admindashboard/orders",
    },
    {
      title: "Feedbacks",
      count: feedbacks.length,
      icon: <FeedbackIcon />,
      path: "/admindashboard/feedback",
    },
    {
      title: "News Feeds",
      count: newsFeeds.length,
      icon: <NewsFeedIcon />,
      path: "/admindashboard/newsfeed",
    },
    {
      title: "Suppliers",
      count: suppliers.length,
      icon: <SuppliersIcon />,
      path: "/admindashboard/suppliers",
    },
    {
      title: "Inventory",
      count: items.length, // You might need to pass in a prop for item count or use a state for it
      icon: <InventoryIcon />,
      path: "/admindashboard/inventory", // This is where it navigates to the AdminItemManagement component
    },
  ];

  return (
    
    <Container
      maxWidth="lg"
      sx={{
        mt: 2,
        mb: 2,
        backgroundImage: 'url("https://static.vecteezy.com/system/resources/previews/042/887/235/non_2x/flat-people-order-food-online-grocery-shopping-from-mobile-application-internet-purchases-with-home-delivery-from-supermarket-store-smartphone-screen-with-buy-button-and-basket-full-of-products-vector.jpg")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
        <Typography variant="h4" gutterBottom component="h1" color="white"  sx={{ color: "#000000", fontWeight: "bold", marginBottom: 5 }}>
          Admin Dashboard
        </Typography>
        <Grid container spacing={5}>
          {dashboardItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.title}>
              <DashboardCard
                title={item.title}
                count={item.count}
                icon={item.icon}
                onClick={() => navigate(item.path)}
              />
            </Grid>
          ))}
        </Grid>
    </Container>
  );
};

export default AdminDashboardScreen;
