// class CORSMiddleware {
//     constructor() {}
  
//     applyCORS(req, res, next) {
//       // Set CORS headers
//     //   res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any domain
//     //   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     //   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
//     //   Handle pre-flight requests for CORS
//     //   if (req.method === 'OPTIONS') {
//     //     res.sendStatus(200);
//     //     return;
//     //   }
  
//       next();
//     }
  
//     // Any additional methods related to CORS can be added here
//   }
  
//   module.exports = new CORSMiddleware();
  




const cors = require('cors');

// CORS options
const corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200
};

// Export the configured CORS middleware
module.exports = cors(corsOptions);



