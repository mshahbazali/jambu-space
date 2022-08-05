const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const asyncMiddleware = require("../../middlewares/async");
const imagesUploader = require("../../helpers/imagesUploader");
const validateId = require("../../middlewares/validateId");
const isEmpty = require("../../helpers/isEmpty");
const removeFile = require("../../helpers/removeFile");

const Job = require("../../models/Job");
const Notification = require("../../models/Notification");
const Customer = require("../../models/Customer");
const Seller = require("../../models/Seller");
const UserOtpVerification = require("../../models/UserOTPVerification")
const { validateCustomer } = require("../../models/Customer");
const nodemailer = require("nodemailer");


const customerImageUrl = "/media/images/customer/";


function validateSellerImageFile(file) {
  if (!file.image) return "Customer Image is required!";
  return null;
}

const uploadSellerImageMiddleware = imagesUploader(
  validateCustomer,
  "/customer"
).fields([{ name: "image", maxCount: 1 }]);

router.get(
  "/",
  asyncMiddleware(async (_, res) => {
    const response = await Customer.find();
    res.json(response);
  })
);

router.delete(
  "/:id",
  validateId,
  asyncMiddleware(async (req, res) => {
    const CustomerID = req.params.id;
    const result = await Customer.findByIdAndDelete(CustomerID);

    if (result.image) removeFile(result.image.path);

    res.json({ id: result._id } || {});
  })
);

router.get(
  "/:id",
  validateId,
  asyncMiddleware(async (req, res) => {
    const customerID = req.params.id;
    const response = await Customer.findById(customerID);
    res.json(response || {});
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

router.put(
  "/:id",
  validateId,
  asyncMiddleware(async (req, res) => {
    const customerID = req.params.id;

    uploadSellerImageMiddleware(req, res, async (err) => {
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

      const customerExist = await Customer.findById(customerID);

      if (customerExist) {
        const payload = {
          fullName: req.body.fullName,
          username: req.body.username,
          email: req.body.email,
          country: req.body.country,
          phone: req.body.phone,
          company: req.body.company,
          rating: req.body.rating,
          jobs: req.body.jobs,
        };

        if (req.files.image) {
          const customerImage = {
            path: req.files.image[0].path,
            url: customerImageUrl + req.files.image[0].filename,
            filename: req.files.image[0].originalname,
          };
          payload.image = customerImage;
        }

        const result = await Customer.findByIdAndUpdate(customerID, {
          $set: payload,
        });

        if (req.files.image && result.image) removeFile(result.image.path);

        res.json({ message: "Customer Updated Successfully!" });
      }
    });
  })
);

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    uploadSellerImageMiddleware(req, res, async (err) => {
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
        const customerImage = {
          path: req.files.image[0].path,
          url: customerImageUrl + req.files.image[0].filename,
          filename: req.files.image[0].originalname,
        };
        payload.image = customerImage;
      }

      const notificationPayload = {
        description: `New Customer (${payload.username}) joined`,
        image: payload.image,
      };

      const error = validateSellerImageFile(req.files);
      if (error) return res.status(400).json({ message: error });

      const customer = new Customer(payload);
      await customer.save();




      const notification = new Notification(notificationPayload);
      await notification.save();

      res.json({ message: "Customer Added Successfully Boy!" });
    });
  })
);

router.delete(
  "/:id",
  validateId,
  asyncMiddleware(async (req, res) => {
    const customerID = req.params.id;
    const result = await Customer.findByIdAndDelete(customerID);

    if (result.image) removeFile(result.image.path);

    res.json({ id: result._id } || {});
  })
);

module.exports = router;

//verify otp
router.post("/verifyOTP", async (req, res) => {
  try {

    let { userId, otp, userType } = req.body;
    if (!userId || !otp || !userType) {
      throw Error("Empty OTP details are not allowed!");
    } else {
      const UserOTPVerificationRecords = await UserOtpVerification.find({
        userId,
      });
      if (UserOTPVerificationRecords.length <= 0) {
        //no record found
        throw new Error(
          "Account record doesn't exist or has been verified already. Please Signup or login.  "
        );
      } else {
        const { expiresAt } = UserOTPVerificationRecords[0];
        const hashedOTP = UserOTPVerificationRecords[0].otp;

        if (expiresAt < Date.now()) {
          await UserOtpVerification.deleteMany({ userId });
          throw new Error("Code has expired, Please request again")
        } else {
          ;
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          if (!validOTP) {
            throw new Error("Invalid code passed, check you email inbox");
          } else {

            if (userType === 'customer') {
              await Customer.updateOne({ _id: userId }, { emailVerified: true });
              await UserOtpVerification.deleteMany({ userId });
              res.json({
                status: "Verified",
                message: "Customer Email verified successfully",
              });
            }

            if (userType === 'seller') {
              await Seller.updateOne({ _id: userId }, { emailVerified: true });
              await UserOtpVerification.deleteMany({ userId });
              res.json({
                status: "Verified",
                message: "Seller Email verified successfully",
              });
            }

          }
        }
      }
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

//resend the verification code

router.post("/resendOTPVerificationCode", async (req, res) => {
  try {
    let { userId, email } = req.body;
    if (!userId || !email) {
      throw Error("Empty user details are not allowed");
    } else {
      await UserOtpVerification.deleteMany({ userId });
      res.json({ message: "OTP Sent Successfully" })
      sendOTPVerificationEmail({ _id: userId, email }, res);
    }
  } catch (error) {
    console.log('error in resending otp verification code :', error)
  }
});



let transporter = nodemailer.createTransport({
  // host: "smtp-mail.outlook.com",

  // auth: {
  //   user: "faizanch2077@outlook.com",
  //   pass: "80C7D707 ",
  // },
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "usamanasir551@gmail.com",
    pass: "vzkssawegauokcgo",
  },
});


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
    const newOTPVerification = new UserOtpVerification({
      userId: _id,
      otp: hashedOTP,
      createdDate: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    // save otp record to db
    await newOTPVerification.save();
    await transporter.sendMail(mailOption);
    res.json({
      status: "__PENDING",
      message: "Verification OTP Sent",
      data: {
        userId: _id,
        email,
      },
    });
  } catch (error) {
    console.log('error in sending otp verification email:', error)
  }
};



