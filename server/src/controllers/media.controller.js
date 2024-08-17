import responseHandler from "../handlers/response.handler.js";
import tmdbApi from "../tmdb/tmdb.api.js";
import userModel from "../models/user.model.js";
import favoriteModel from "../models/favorite.model.js";
import reviewModel from "../models/review.model.js";
import tokenMiddlerware from "../middlewares/token.middleware.js";

/**
 * Retrieves a list of media based on media type and category.
 * @param {Object} req - The request object containing query parameters and path parameters.
 * @param {Object} res - The response object used to send the response.
 */
const getList = async (req, res) => {
  try {
    const { page } = req.query;
    const { mediaType, mediaCategory } = req.params;

    const response = await tmdbApi.mediaList({ mediaType, mediaCategory, page });

    return responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};

/**
 * Retrieves a list of genres based on the media type.
 * @param {Object} req - The request object containing path parameters.
 * @param {Object} res - The response object used to send the response.
 */
const getGenres = async (req, res) => {
  try {
    const { mediaType } = req.params;

    const response = await tmdbApi.mediaGenres({ mediaType });

    return responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};

/**
 * Searches for media based on a query and media type.
 * @param {Object} req - The request object containing query parameters and path parameters.
 * @param {Object} res - The response object used to send the response.
 */
const search = async (req, res) => {
  try {
    const { mediaType } = req.params;
    const { query, page } = req.query;

    const response = await tmdbApi.mediaSearch({
      query,
      page,
      mediaType: mediaType === "people" ? "person" : mediaType
    });

    responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};

/**
 * Retrieves detailed information about a specific media item, including credits, videos, recommendations, images, and user-specific data.
 * @param {Object} req - The request object containing path parameters.
 * @param {Object} res - The response object used to send the response.
 */
const getDetail = async (req, res) => {
  try {
    const { mediaType, mediaId } = req.params;

    const params = { mediaType, mediaId };

    const media = await tmdbApi.mediaDetail(params);

    // Fetching additional details for the media
    media.credits = await tmdbApi.mediaCredits(params);
    media.videos = await tmdbApi.mediaVideos(params);
    media.images = await tmdbApi.mediaImages(params);

    const recommend = await tmdbApi.mediaRecommend(params);
    media.recommend = recommend.results;

    // Decoding the token to get user-specific data
    const tokenDecoded = tokenMiddlerware.tokenDecode(req);

    if (tokenDecoded) {
      const user = await userModel.findById(tokenDecoded.data);

      if (user) {
        const isFavorite = await favoriteModel.findOne({ user: user.id, mediaId });
        media.isFavorite = isFavorite !== null;
      }
    }

    // Fetching reviews for the media
    media.reviews = await reviewModel.find({ mediaId }).populate("user").sort("-createdAt");

    responseHandler.ok(res, media);
  } catch (e) {
    console.log(e);
    responseHandler.error(res);
  }
};

export default { getList, getGenres, search, getDetail };
