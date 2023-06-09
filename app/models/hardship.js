const { default: mongoose } = require("mongoose");

const HardshipSchema = new mongoose.Schema({
    title : {type : String},
},{
timestamps : true,
toJSON : {
    virtuals : true
}}
)

module.exports = {
    HardshipModel : mongoose.model("hardship", HardshipSchema)
}