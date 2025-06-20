require("dotenv").config();
const express = require("express")
const bodyparser = require("body-parser")
const ejs =require ("ejs")
const mongoose = require("mongoose")

const cookieparser = require("cookie-parser");
const  verifyAuthenticationToken  = require("./middelware.js/auth-middelware.js");
const app = express();
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(cookieparser()); 
app.use(express.json());
// app.use(verifyAuthenticationToken)
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
}); 
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

const { item } = require("./Model/User.js");

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

if(personname===""||personname.trim()===""||password===""||password.trim()===""||name===""||name.trim()===""){
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

       await item.insertOne({
            Name:name,
            user_name:personname,
            password:password
        })
       
         res.render("login",{alertMsg:null})
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
         
        const token = await user.generateToken();
        res.cookie("access_token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.redirect("/secrets");
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

app.get("/secrets",verifyAuthenticationToken,async(req,res)=>{
  
 try {  
   if (!req.user || !req.user.id) {
      return res.redirect("/login?alert=You are not logged in");
    }  
res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "Surrogate-Control": "no-store"
    });

    const user = await item.findById(req.user.id);
    if (!user) return res.redirect("/login?alert=you are not logged in");

    res.render("secrets", {
      exej: {
        id: user._id,
        Name: user.Name,
        email: user.user_name,
        secrets: user.secrets,
      },
    });
  } catch (error) {
    console.error(error);
    res.redirect("/login");
  }
})
app.post("/logout",async(req,res)=>{
  try {
        res.clearCookie("access_token", {
    httpOnly: true,
    secure: false, 
    sameSite: "Lax",
  });
  res.render("login",{alertMsg:null})

  } catch (error) {
     console.log(error)
        res.send({ message: "Error occurred during logout" });
  }
   
})



app.post("/secrets",verifyAuthenticationToken,async(req,res)=>{
  
  
    
     try {         
res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "Surrogate-Control": "no-store"
    });
     const  secret=req.body.secret;
          const user = await item.findById(req.user.id);
    if (!user) return res.redirect("/login?alert=you are not logged in");
    await item.updateOne({_id:req.user.id},{$push:{secrets:secret}})
  
    const  mysecret = await item.findOne({_id:req.user.id})
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








