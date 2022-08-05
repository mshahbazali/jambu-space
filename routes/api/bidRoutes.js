const express = require("express");
const router = express.Router();

const Notification = require('../../models/Notification')
const Seller = require('../../models/Seller')
const asyncMiddleware = require('../../middlewares/async')
const imagesUploader = require('../../helpers/imagesUploader')
const { validateBid } = require('../../models/Bid')
const Bid = require('../../models/Bid')
const Job = require('../../models/Job')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');



//MULTER



// Data Create 
const DIR = './public/media/images/bid/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});





router.post(
    "/",
    upload.single("image"),
    async (req, res) => {
        try {
            if (req.file) {
                const bidImage = {
                    path: req.file.path,
                    url: '/media/images/bid/' + req.file.filename,
                    filename: req.file.originalname,
                };
                req.body.image = bidImage;
            }


            const addBid = new Bid(req.body)
            addBid.save()


            //notification
            const notificationPayload = {
                description: `New Bid of amount (${req.body.amount}) is created`,
                image: req.body.image,
            };

            const notification = new Notification(notificationPayload);
            await notification.save();


            // Add BidID in Job as well

            await Job.findByIdAndUpdate(req.body.jobID, {
                $push: { bids: addBid._id },
            });

            // Add BidID in Seller Bids as well
            if (req.body.sellerID)
                await Seller.findByIdAndUpdate(req.body.sellerID, {
                    $push: { bids: addBid._id },
                });


            res.send(req.body)
        }
        catch (err) {
            console.log("Error", err)
        }
    }
);



router.get(
    "/getbids/:id",
    async (req, res) => {
        try {
            const jobID = req.params.id
            const bids = await Bid.find({ jobID: jobID }).exec()
                .then(async (bids) => {
                    for (var i = 0; i < bids.length; i++) {
                        const findSeller = await Seller.findOne({ _id: bids[i].sellerID })
                        bids[i] = {...bids[i],seller: findSeller }
                    }
                    res.send(bids)
                })




        }
        catch (err) {
            console.log("Error", err)
        }
    }
)





router.get(
    "/get/:id",
    async (req, res) => {
        try {
            const sellerID = req.params.id
            const bids = await Bid.find({ sellerID: sellerID }).exec()
                .then(async (bids) => {
                    res.send(bids)
                })




        }
        catch (err) {
            console.log("Error", err)
        }
    }
)




router.delete(
    "/delete/:id",
    async (req, res) => {
        try {
            const bidID = req.params.id;
            const findBid = await Bid.findOne({ _id: bidID })

            // delete from job

            const findJob = await Job.findOne({ _id: findBid.jobID })
            const jobBids = findJob.bids
            const filteredJobBids = jobBids.filter(bid => bid != bidID)
            findJob.bids = filteredJobBids
            const upateJob = await Job.findByIdAndUpdate(findJob._id, findJob)



            // delete from seller 

            const findSeller = await Seller.findOne({ _id: findBid.sellerID })
            const sellerBids = findSeller.bids
            const filteredSellerBids = sellerBids.filter(bid => bid != bidID)
            findSeller.bids = filteredSellerBids
            const updadateSeller = await Seller.findByIdAndUpdate(findSeller._id, findSeller)


            //delete bid

            const deleteBid = await Bid.findByIdAndDelete(bidID)
            res.send({ message: "Proposal deleted Successfully" })
        }
        catch (e) {
            res.send(e)
        }
    }
)



module.exports = router

