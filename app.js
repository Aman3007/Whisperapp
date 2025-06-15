require("dotenv").config();
const express = require("express")
const bodyparser = require("body-parser")
const ejs =require ("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app = express();
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyparser.urlencoded({ extended: true }))


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

const enterSchema = new mongoose.Schema({
    Name:String,
    user_name: String,
    password:String,
    secrets:[String]
})
const secret ="Amankijaiho";
enterSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]})
const item = mongoose.model("info", enterSchema)

app.get("/",(req,res)=>{
    res.render("home")
})
app.get("/login",(req,res)=>{
    res.render("login",{alertMsg:null})
})
app.get("/register",(req,res)=>{
    res.render("register",{alertMsg:null})
})

app.post("/register",async(req,res)=>{
      const  personname=req.body.username;
      const  password=req.body.password;
      const name =req.body.name;

if(personname===""||personname.trim()===""||password===""||password.trim()===""){
     res.render("register",{alertMsg:"Please fill all the field"})}
else{
try {
    const user= await  item.findOne({user_name:personname})
      if(user){

        if(user.password===password){
            res.render("login",{alertMsg:"You are already a user please login"})   /// send this msg
        }
       else{
               res.render("register",{alertMsg:"Already exist username plase add another one"})
       }
      }
      else{

       const newuser = await item.insertOne({
            Name:name,
            user_name:personname,
            password:password
        })

         res.render("secrets",{exej:newuser})
      }
}
catch (error) {
        console.log(error)
}}  
} )



app.post("/login",async(req,res)=>{

  
      const  username=req.body.username;
     const   password=req.body.password;
    
if(username===""||username.trim()===""||password===""||password.trim()===""){
     res.render("login",{alertMsg:"Please fill all the field"})
}
else{
     try {
      const user= await  item.findOne({user_name:username})
      if(user){

        if(user.password===password){
          res.render("secrets",{exej:user})
        }
       else{
               res.render("login",{alertMsg:"Your password does not match please try again "})
       }
      }
else{
      res.render("register",{alertMsg:"You are Not a Registered user please regester first"})
}
}
 catch (error) {
        console.log(error)
}

}
})





app.post("/submit/:id",async(req,res)=>{
      const  secret=req.body.secret;
    
     try {
    await item.updateOne({_id:req.params.id},{$push:{secrets:secret}})
  
    const  mysecret = await item.findOne({_id:req.params.id})
         res.render("secrets",{exej:mysecret})

}
 catch (error) {
        console.log(error)
}
}
)


app.listen(3000, () => {
    console.log("server started")
})








