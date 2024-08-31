import { validationResult } from "express-validator"; // Importing the validationResult function from express-validator package.

  const validate = (req, res, next) => { // Middleware function to handle validation results.
  const errors = validationResult(req); // Extract validation errors from the request.
  
  if (!errors.isEmpty()) return res.status(400).json({ // If there are validation errors, respond with a 400 status code and the first error message.

  message: errors.array()[0].msg // Send the first validation error message in the response.
  });
    
  next(); // If no validation errors, proceed to the next middleware or route handler.
  };

export default { validate }; 
// Exporting the validate function as part of an object for use in other parts of the application.
