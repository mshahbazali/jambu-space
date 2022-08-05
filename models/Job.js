const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    bids: {
      type: Array
    },
    description: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    customerID: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
    hoursNeeded: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: String,
      required: true,
    },
    technologies: [{
      type: String,
      required: true,
    }],
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
      required: true,
    },
    deliveryDate: String,
    sellerID: String,
  },
  { timestamps: true }
);

const validateJob = function (job) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    budget: Joi.number(),
    status: Joi.string(),
    customerID: Joi.string().required(),
    dueDate: Joi.string().required(),
    deliveryDate: Joi.string(),
    sellerID: Joi.string(),
    hoursNeeded: Joi.string().required(),
    duration: Joi.string().required(),
    experienceLevel: Joi.string().required(),
    technologies: Joi.string().required(),
  });

  return schema.validate(job);
};

module.exports = mongoose.model("Jobs", jobSchema);
module.exports.validateJob = validateJob;
