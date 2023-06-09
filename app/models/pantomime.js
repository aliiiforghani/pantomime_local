const { default: mongoose } = require("mongoose");

const PantomimeSchema = new mongoose.Schema({
    title : {type : String},
    text : {type : String, required: true},
    hardship : {type: mongoose.Types.ObjectId, ref: "hardship", required: true},
    published: {type: Boolean, required: true, default : false},
    category: {type: [mongoose.Types.ObjectId], ref: "category", required: true}
},{
timestamps : true,
toJSON : {
    virtuals : true
}}
)

module.exports = {
    PantomimeModel : mongoose.model("pantomime", PantomimeSchema)
}