const mongoose = require("mongoose")
require("dotenv").config();
const jwt = require("jsonwebtoken");
const encrypt = require("mongoose-encryption")
const enterSchema = new mongoose.Schema({
    Name:String,
    user_name: String,
    password:String,
    secrets:[String]
})
const secret ="Amansinghchauhan";
enterSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]})
enterSchema.methods.generateToken=async function(){
    try {
        return jwt.sign({
            userid:this._id.toString(),
            username:this.user_name,
            usersecret:this.secrets
          
           
        }, process.env.JWT_SECURE_KEY,{
            expiresIn:"30d"
        })
       
    } catch (error) {
        console.log("error")
    }
}

const VerifyJWTToken=(token)=>{
  return  jwt.verify(token,process.env.JWT_SECURE_KEY)
}
module.exports = {
  item: mongoose.model("info", enterSchema),
  VerifyJWTToken
};