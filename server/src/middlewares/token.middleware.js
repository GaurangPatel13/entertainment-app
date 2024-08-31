import jsonwebtoken from "jsonwebtoken"; // Importing the jsonwebtoken library.
import responseHandler from "../handlers/response.handler.js"; // Importing custom response handlers.
import userModel from "../models/user.model.js"; // Importing the user model.

// Function to decode the JWT from the request headers.
const tokenDecode = (req) => {
  try {
    const bearerHeader = req.headers["authorization"];
    // Extracting the authorization header from the request.

    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];
      // Splitting the bearer token from the "Bearer <token>" format.

      return jsonwebtoken.verify(
        token,
        process.env.TOKEN_SECRET
      );
      // Verifying the token using the secret key from environment variables.
    }

    return false;
    // Return false if the authorization header is not present.
  } catch {
    return false;
    // Return false if an error occurs during token decoding.
  }
};

const auth = async (req, res, next) => {
  // Middleware function to authenticate the user based on the JWT.

  const tokenDecoded = tokenDecode(req);
  // Decode the token from the request.

  if (!tokenDecoded) return responseHandler.unauthorize(res);
  // If token decoding fails, respond with a 401 Unauthorized status.

  const user = await userModel.findById(tokenDecoded.data);
  // Find the user in the database using the ID decoded from the token.

  if (!user) return responseHandler.unauthorize(res);
  // If the user is not found, respond with a 401 Unauthorized status.

  req.user = user; // Attach the user object to the request object for use in subsequent middleware/routes.

  next(); // Proceed to the next middleware or route handler.
};

export default { auth, tokenDecode };
// Exporting the auth middleware and tokenDecode function for use in other parts of the application.
