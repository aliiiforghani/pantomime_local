const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    first_name : {type : String},
    last_name : {type : String},
    username : {type : String, required: true, lowercase: true},
    mobile : {type : String, unique: true},
    email : {type : String, lowercase: true},
    password : {type : String, required: true},
    Role : {type : [String], default : "USER"},
},{
timestamps : true,
toJSON : {
    virtuals : true
}}
)
module.exports = {
    UserModel : mongoose.model("user", UserSchema)
}