const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const asyncMiddleware = require("../../../middlewares/async");
const imagesUploader = require("../../../helpers/imagesUploader");
const validateId = require("../../../middlewares/validateId");
const isEmpty = require("../../../helpers/isEmpty");

const Job = require("../../../models/Job");
const Review = require("../../../models/Review");
const Notification = require("../../../models/Notification");
const Customer = require("../../../models/Customer");
const Seller = require("../../../models/Seller");
const Admin = require('../../../models/Admin')
const { validateCustomer } = require("../../../models/Customer");
const { validateSeller } = require("../../../models/Seller");

const customerImageUrl = "/media/images/customer/";
const sellerImageUrl = "/media/images/seller/";

const UserOTPVerification = require("../../../models/UserOTPVerification");


const nodemailer = require("nodemailer");


const { vr: uuidv4 } = require("uuid");

const path = require("path");

function validateSellerImageFile(file) {
  if (!file.image) return "Seller Image is required!";
  return null;
}

const uploadCustomerImageMiddleware = imagesUploader(
  validateCustomer,
  "/customer"
).fields([{ name: "image", maxCount: 1 }]);

const uploadSellerImageMiddleware = imagesUploader(
  validateSeller,
  "/seller"
).fields([{ name: "image", maxCount: 1 }]);

router.post(
  "/login",
  asyncMiddleware(async (req, res) => {
    const isCustomer = req.body.type === "customer";
    const isSeller = req.body.type === "seller";
    const isAdmin = req.body.type === "admin";

    if (isCustomer) {
      const customer = await Customer.findOne({ email: req.body.email });
      if (!customer)
        return res.status(400).json({ message: "Invalid Email or Password!" });

      const validPassword = await bcrypt.compare(
        req.body.password,
        customer.password
      );

      if (!validPassword)
        return res.status(400).json({ message: "Invalid Email or Password!" });

      if (!customer.emailVerified)
        return res.status(400).json({ message: "User Not Verified" });

      res.json(customer);
    }

    if (isSeller) {
      const seller = await Seller.findOne({ email: req.body.email });
      if (!seller)
        return res.status(400).json({ message: "Invalid Email or Password!" });

      if (!seller.emailVerified)
        return res.status(400).json({
          message: "Please check your email and verify your account!",
        });

      const validPassword = await bcrypt.compare(
        req.body.password,
        seller.password
      );

      if (!validPassword)
        return res.status(400).json({ message: "Invalid Email or Password!" });

      res.json(seller);
    }

    if (isAdmin) {
      const admin = await Admin.findOne({ email: req.body.email });
      console.log('admin', admin)
      if (!admin)
        return res.status(400).json({ message: "Invalid Email or Password!" });

      const validPassword = await bcrypt.compare(
        req.body.password,
        admin.password
      );

      if (!validPassword)
        return res.status(400).json({ message: "Invalid Email or Password!" });

      res.json(admin);
    }
  })
);

router.get(
  "/:id",
  validateId,
  asyncMiddleware(async (req, res) => {
    const userID = req.params.id;
    const customer = await Customer.findById(userID);
    const seller = await Seller.findById(userID);
    res.json(customer || seller || {});
  })
);

router.get(
  "/:id/reviews",
  validateId,
  asyncMiddleware(async (req, res) => {
    const userID = req.params.id;
    const response = await Review.find({ userID: userID });
    res.json(response);
  })
);

router.get(
  "/:id/jobs",
  validateId,
  asyncMiddleware(async (req, res) => {
    const customerID = req.params.id;
    const response = await Job.find({ customerID: customerID });
    res.json(response);
  })
);
router.post(
  "/seller/skills/add",
  asyncMiddleware(async (req, res) => {
    const seller = await Seller.findById(req.body.sellerID);
    seller.skills = [...seller.skills, req.body.skill];
    await seller.save();
    res.json({ skills: seller.skills });
  })
);









//nodemailer stuff
let transporter = nodemailer.createTransport({
  // host: 'gmail',
  // host: process.env.EMAIL_HOST,
  // host: "smtp.gmail.com",
  // auth: {
  //   user: "usamanasir551@gmail.com",
  //   pass: "bkludhvmuczjqpab",
  //   // user: process.env.EMAIL_USERNAME,
  //   // pass: process.env.EMAIL_PASSWORD,
  // },
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "usamanasir551@gmail.com",
    pass: "vzkssawegauokcgo",
  },

});

// testing success

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for message");
    console.log(success);
  }
});

//send verfiication OTP email
const sendOTPVerificationEmail = async ({ _id, email }, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const mailOption = {
      from: "faizanch2077@outlook.com",
      to: email,
      subject: "Verify Email",
      html: `<p>Enter ${otp} in the app to verify your account, this code will expired in <b>1 hour</b></p>`,
    };
    //hash the otp
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const newOTPVerification = new UserOTPVerification({
      userId: _id,
      otp: hashedOTP,
      createdDate: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    // save otp record to db
    await newOTPVerification.save();
    await transporter.sendMail(mailOption);
    // res.json({
    //   status: "__PENDING",
    //   message: "Verification OTP Sent",
    //   data: {
    //     userId: _id,
    //     email,
    //   },
    // });
  } catch (error) {
    console.log('error in sending otp verification email:', error)
  }
};














router.post(
  "/user/:userType",
  asyncMiddleware(async (req, res) => {
    const userType = req.params.userType;
    const isCustomer = userType === "customer";
    if (isCustomer) {
      uploadCustomerImageMiddleware(req, res, async (err) => {
        if (err)
          return err.code === "LIMIT_FILE_SIZE"
            ? res
              .status(400)
              .json({ message: "File too large. Must be less than 200 KB" })
            : res.status(400).json({ message: err.message });

        if (isEmpty(req.files)) {
          const { error } = validateCustomer(req.body);
          if (error)
            return res.status(400).json({ message: error.details[0].message });
        }

        const customerExists = await Customer.findOne({ email: req.body.email })
        if (customerExists)
          return res.status(400).json({ message: "Customer with this email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPasword = await bcrypt.hash(req.body.password, salt);

        const payload = {
          fullName: req.body.fullName,
          username: req.body.username,
          email: req.body.email,
          password: hashedPasword,
          country: req.body.country,
          phone: req.body.phone,
          company: req.body.company,
          rating: req.body.rating,
          jobs: req.body.jobs,
          emailVerified: false
        };

        if (req.files.image) {
          const customerImage = {
            path: req.files.image[0].path,
            url: customerImageUrl + req.files.image[0].filename,
            filename: req.files.image[0].originalname,
          };
          payload.image = customerImage;
        }

        const notificationPayload = {
          description: `New Customer (${payload.username}) joined`,
          image: payload?.image,
        };

        const customer = new Customer(payload);
        customer
          .save()

          .then((result) => {
            res.json(result)
            sendOTPVerificationEmail(result, res);
          })
          .catch((err) => {
            console.log(err.message);
            console.log("Error in sending otp verification email in signup api");
          });

        const notification = new Notification(notificationPayload);
        await notification.save();

      });
    }
    else {

      uploadSellerImageMiddleware(req, res, async (err) => {
        if (err)
          return err.code === "LIMIT_FILE_SIZE"
            ? res
              .status(400)
              .json({ message: "File too large. Must be less than 200 KB" })
            : res.status(400).json({ message: err.message });

        if (isEmpty(req.files)) {
          const { error } = validateSeller(req.body);
          if (error)
            return res.status(400).json({ message: error.details[0].message });
        }

        const sellerExists = await Seller.findOne({ email: req.body.email })
        if (sellerExists)
          return res.status(400).json({ message: "Seller with this email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPasword = await bcrypt.hash(req.body.password, salt);

        const payload = {
          fullName: req.body.fullName,
          username: req.body.username,
          email: req.body.email,
          password: hashedPasword,
          country: req.body.country,
          phone: req.body.phone,
          company: req.body.company,
          rating: req.body.rating,
          jobs: req.body.jobs,
        };

        if (req.files.image) {
          const sellerImage = {
            path: req.files.image[0].path,
            url: sellerImageUrl + req.files.image[0].filename,
            filename: req.files.image[0].originalname,
          };
          payload.image = sellerImage;
        }

        const notificationPayload = {
          description: `New Seller (${payload.username}) joined`,
          image: payload?.image,
        };

        const seller = new Seller(payload);
        seller
          .save()

          .then((result) => {
            res.json(result)
            sendOTPVerificationEmail(result, res);
          })
          .catch((err) => {
            console.log(err.message);
            console.log("Error in sending otp verification email in signup api");
          });

        const notification = new Notification(notificationPayload);
        await notification.save();

      });
    }
  })
);

router.put(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const userID = req.params.id;
    const isCustomer = req.body.type === "customer";
    if (isCustomer) {
      const payload = {
        fullName: req.body.fullName,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        country: req.body.country,
        phone: req.body.phone,
        company: req.body.company,
        rating: req.body.rating,
        jobs: req.body.jobs,
        image: req.body.image,
      };

      await Customer.findByIdAndUpdate(userID, payload);
      res.json({ message: "Profile Updated Successfully!" });
    } else {
      const payload = {
        fullName: req.body.fullName,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        country: req.body.country,
        phone: req.body.phone,
        company: req.body.company,
        rating: req.body.rating,
        jobs: req.body.jobs,
        image: req.body.image,
      };

      await Seller.findByIdAndUpdate(userID, payload);
      res.json({ image: "Profile Updated Successfully!" });
    }
  })
);

router.put(
  "/picture/:id",
  asyncMiddleware(async (req, res) => {
    const userID = req.params.id;
    const isCustomer = req.body.type === "customer";
    if (isCustomer) {
      uploadCustomerImageMiddleware(req, res, async (err) => {
        if (err)
          return err.code === "LIMIT_FILE_SIZE"
            ? res
              .status(400)
              .json({ message: "File too large. Must be less than 200 KB" })
            : res.status(400).json({ message: err.message });

        const customerImage = {
          path: req.files.image[0].path,
          url: customerImageUrl + req.files.image[0].filename,
          filename: req.files.image[0].originalname,
        };

        await Customer.findByIdAndUpdate(userID, {
          $set: { image: customerImage },
        });
        res.json({ image: customerImage });
      });
    } else {
      uploadSellerImageMiddleware(req, res, async (err) => {
        if (err)
          return err.code === "LIMIT_FILE_SIZE"
            ? res
              .status(400)
              .json({ message: "File too large. Must be less than 200 KB" })
            : res.status(400).json({ message: err.message });

        const customerImage = {
          path: req.files.image[0].path,
          url: sellerImageUrl + req.files.image[0].filename,
          filename: req.files.image[0].originalname,
        };

        await Seller.findByIdAndUpdate(userID, {
          $set: { image: customerImage },
        });
        res.json({ image: customerImage });
      });
    }
  })
);



module.exports = router;
