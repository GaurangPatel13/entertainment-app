const responseWithData = (res, statusCode, data) => res.status(statusCode).json(data);
// Utility function to send a JSON response with a specific status code and data.

const error = (res) => responseWithData(res, 500, {
  status: 500,
  message: "Oops! Something worng!"
});
// Function to send a 500 Internal Server Error response with a generic error message.

const badrequest = (res, message) => responseWithData(res, 400, {
  status: 400,
  message
});
// Function to send a 400 Bad Request response with a custom error message.

const ok = (res, data) => responseWithData(res, 200, data);
// Function to send a 200 OK response with the provided data.

const created = (res, data) => responseWithData(res, 201, data);
// Function to send a 201 Created response with the provided data.

const unauthorize = (res) => responseWithData(res, 401, {
  status: 401,
  message: "Unathorized"
});
// Function to send a 401 Unauthorized response with a generic message.

const notfound = (res) => responseWithData(res, 404, {
  status: 404,
  message: "Resource not found"
});
// Function to send a 404 Not Found response with a generic message.

export default {
  error,
  badrequest,
  ok,
  created,
  unauthorize,
  notfound
};
// Exporting the response utility functions for use in other parts of the application.
