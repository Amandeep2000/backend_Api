const { response } = require("express");

function successResponse({status=200,success=true, message='Successfull', data=null}) {
  const responseData = {
    status,
    success,
    message,
    data
  };

  return responseData;
}

function errorResponse({status=400,success=false,message='Failed',error='server error'}) {
  
  const responseData = {
    status,
    success,
    message,
  };
  return responseData;
}

module.exports = {
  successResponse,
  errorResponse,
};