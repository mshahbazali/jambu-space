const express = require("express");
const cors = require("cors");

// Auth Routes
const users = require("../routes/api/userRoutes");
const auth = require("../routes/api/authRoutes");
// const authMiddleware = require("../middlewares/auth");

// Page Routes
const SellerRoutes = require("../routes/api/sellerRoutes");
const CustomerRoutes = require("../routes/api/customerRoutes");
const JobRoutes = require("../routes/api/jobRoutes");
const NotificationRoutes = require("../routes/api/notificationRoutes");
const bidRoutes = require('../routes/api/bidRoutes')

// Website Routes
const ClientAuth = require("../routes/api/websiteRoutes/authRoutes");
const ClientJobs = require("../routes/api/websiteRoutes/jobRoutes");
const ClientConversations = require("../routes/api/websiteRoutes/conversationRoutes");
const ClientMessages = require("../routes/api/websiteRoutes/messageRoutes");
const Admin = require("../routes/api/websiteRoutes/adminRoutes")

// Error Routes
const error = require("../middlewares/error");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("./public"));

  // Pages Routes
  app.use("/api/sellers", SellerRoutes);
  app.use("/api/customers", CustomerRoutes);
  app.use("/api/jobs", JobRoutes);
  app.use("/api/notifications", NotificationRoutes);
  app.use("/api/sellers/bids",bidRoutes)

  // Website Routes
  app.use("/api/client/auth", ClientAuth);
  app.use("/api/client/jobs", ClientJobs);
  app.use("/api/client/conversations", ClientConversations);
  app.use("/api/client/messages", ClientMessages);


  // Auth Routes
  app.use("/api/auth", auth);
  app.use("/api/users", users);

  // Admin Routes
  app.use("/api/admin", Admin);


  // Error Logging
  app.use(error);
};
