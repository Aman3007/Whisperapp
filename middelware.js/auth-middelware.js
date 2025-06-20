const { VerifyJWTToken } = require("../Model/User.js");

const verifyAuthenticationToken=((req,res,next)=>{
    const token =req.cookies.access_token;
    
              if (!token) {
      req.user = null;
    return next();
}
   
    try {
        const decodeToken = VerifyJWTToken(token);
        req.user=decodeToken;
        console.log(req.user)
         return next()

    } catch (error) {
        return res.redirect("/login?alert=invalid token");
    }
           
})
module.exports=verifyAuthenticationToken;