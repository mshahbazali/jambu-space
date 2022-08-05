const mongoose = require("mongoose");

const companyMarginSchema = mongoose.Schema({
    margin: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("CompanyMargin", companyMarginSchema);
