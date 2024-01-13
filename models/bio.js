const mongoose = require("mongoose")

const bioSchema = new mongoose.Schema({
    author: String,
    profile: String,
    about : String,
    first :Boolean
})

const bioModel = mongoose.model("bioModel",bioSchema)

module.exports = bioModel;