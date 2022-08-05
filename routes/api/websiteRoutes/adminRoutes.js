const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const asyncMiddleware = require("../../../middlewares/async");
const CompanyMargin = require("../../../models/CompanyMargin")
const Admin = require("../../../models/Admin");

router.put(
    "/companyMargin",
    asyncMiddleware(async (req, res) => {

        const updatedCompanyMargin = await CompanyMargin.updateOne({ margin: req.body.margin })

        res.status(200).send(updatedCompanyMargin);
    })
);

router.get(
    "/companyMargin",
    asyncMiddleware(async (req, res) => {
        const companyMargin = await CompanyMargin.find({})
        res.status(200).send(companyMargin);
    })
);


router.put("/updateProfile/:id",
    asyncMiddleware(async (req, res) => {

        const admin = await Admin.findById(req.params.id);
        if (!admin)
            return res.json({ message: "Admin not found" })


        const salt = await bcrypt.genSalt(10);
        const hashedPasword = await bcrypt.hash(req.body.password, salt);

        const updatedAdmin = await Admin.updateOne({ "_id": req.params.id },
            { $set: { "email": req.body.email, "password": hashedPasword } })

        res.status(200).send(updatedAdmin);
    })
)

module.exports = router;
