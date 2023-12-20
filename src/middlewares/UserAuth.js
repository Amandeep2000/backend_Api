const jwt=require('jsonwebtoken');
// const {apiresponse}=require('@helper/helper');
const { invalidatedTokens,
  addToInvalidatedTokens, } = require('@helper/tokenmanager');

  const { successResponse, errorResponse } = require("@helper/helper"); 
const secretKey=process.env.TOKENKEY;


class AuthenticateTokenMiddleware
{
    constructor() {}
    authenticateToken(req, res, next) {
    
      const token = req.header("Authorization");
      
     
  if(!token) return res.status(400).json(errorResponse({message:"No token provided"}));
  

      if(invalidatedTokens.has(token)){
    
        return res.status(400).json(errorResponse({message:"Token is no longer valid"}));
      }
  
      jwt.verify(token,secretKey,(err,user)=>
      {
        if (err){
          // return  apiresponse(res, 403,"Invalid Token", null, err);
          return res.status(400).json(errorResponse({message:"Invalid Token",err}));
        }
        
        req.user = user;
     
        next();
      });
    }
  
   
    test() {}
  }



  module.exports = new AuthenticateTokenMiddleware();
  






