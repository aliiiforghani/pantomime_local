const { default: mongoose } = require("mongoose");

const CategorySchema = new mongoose.Schema({
    title : {type : String},
},{
timestamps : true,
toJSON : {
    virtuals : true
}}
)

module.exports = {
    CategoryModel : mongoose.model("category", CategorySchema)
}