const { response } = require("express");
// function apiresponse(res, status, message, data = null, err = null) {
//   const responseData = {

//     status,
//     message,
//   };
//   if (data !== null && data !== undefined) {
//     responseData.data = data;
//   } else if (err !== null && err !== undefined) {
//     responseData.err = err;
//   }
//   res.status(201).json(responseData);
// }
// module.exports = { apiresponse };


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