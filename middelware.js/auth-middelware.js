const { VerifyJWTToken } = require("../Model/User.js");
const verifyAuthenticationToken=((req,res,next)=>{
    const token =req.cookies.access_token;
    if(!token){
        req.User=null;
  
        return next()
    }

    try {
        const decodeToken = VerifyJWTToken(token);
        req.User=decodeToken;
        console.log(req.User)

    } catch (error) {
        console.log(error)
    }
            return next()
})
module.exports=verifyAuthenticationToken;