import responseHandler from "../handlers/response.handler.js";
import favoriteModel from "../models/favorite.model.js";

// Adds a media item to the user's favorites
const addFavorite = async (req, res) => {
  try {
    // Check if the item is already favorited by the user
    const isFavorite = await favoriteModel.findOne({
      user: req.user.id,
      mediaId: req.body.mediaId
    });

    if (isFavorite) {
      // If already favorited, return the existing favorite item
      return responseHandler.ok(res, isFavorite);
    }

    // Create a new favorite entry if not already favorited
    const favorite = new favoriteModel({
      ...req.body,
      user: req.user.id
    });

    // Save the new favorite item to the database
    await favorite.save();

    // Respond with the newly created favorite item
    responseHandler.created(res, favorite);
  } catch {
    // Handle any errors that occur
    responseHandler.error(res);
  }
};

// Removes a media item from the user's favorites
const removeFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.params;

    // Find the favorite item by its ID and user
    const favorite = await favoriteModel.findOne({
      user: req.user.id,
      _id: favoriteId
    });

    if (!favorite) {
      // If the favorite item does not exist, respond with not found
      return responseHandler.notfound(res);
    }

    // Remove the favorite item from the database
    await favorite.remove();

    // Respond with success
    responseHandler.ok(res);
  } catch {
    // Handle any errors that occur
    responseHandler.error(res);
  }
};

// Retrieves all favorite media items for the logged-in user
const getFavoritesOfUser = async (req, res) => {
  try {
    // Find all favorite items for the user, sorted by creation date
    const favorite = await favoriteModel.find({ user: req.user.id }).sort("-createdAt");

    // Respond with the list of favorite items
    responseHandler.ok(res, favorite);
  } catch {
    // Handle any errors that occur
    responseHandler.error(res);
  }
};

export default { addFavorite, removeFavorite, getFavoritesOfUser };
