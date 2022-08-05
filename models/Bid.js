const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const bidSchema = new Schema(
    {
        cover: {
            type: String,
        },
        amount: {
            type: Number,
        },
        status: {
            type: String,
        },
        customerID: {
            type: String,
        },
        sellerID: {
            type: String,
        },
        jobID: {
            type: String,
        },
        duration: {
            type: String,
        },
        bidType: {
            type: String,
        },
        milestones: {
            type: Array,
        },
        image: {
            type: {
                path: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
                filename: String,
            },
            required: false,
        },
    },
    { timestamps: true }
);

const validateBid = function (bid) {
    const schema = Joi.object({
        description: Joi.string().required(),
        amount: Joi.number(),
        status: Joi.string(),
        customerID: Joi.string().required(),
        sellerID: Joi.string(),
        duration: Joi.string().required(),
        experienceLevel: Joi.string().required(),
        jobID: Joi.string().required()
    });

    return schema.validate(bid);
};

module.exports = mongoose.model("Bid", bidSchema);
module.exports.validateBid = validateBid;
