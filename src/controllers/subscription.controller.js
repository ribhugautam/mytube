import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Subscription } from "../models/subscription.model.js";

const subscribe = asyncHandler(async (req, res) => {
  const { channelId } = req.body;
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(400, "User Id is Required");
  }

  if (!channelId) {
    throw new ApiError(400, "Channel Id is Required");
  }

  const subscription = await Subscription.create({
    channel: channelId,
    subscription: userId,
  });

  if (!subscription) {
    throw new ApiError(500, "Subscription Failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subscription, "Subscription Successful"));
});

const unsubscribe = asyncHandler(async (req, res) => {
  const { channelId } = req.body;
  const userId= req.user._id;

  if (!userId) {
    throw new ApiError(400, "User Id is Required");
  }

  if (!channelId) {
    throw new ApiError(400, "Channel Id is Required");
  }

  const subscription = await Subscription.findOneAndDelete({
    channel: channelId,
    subscription: userId,
  });

  if (!subscription) {
    throw new ApiError(500, "Unsubscribed Failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subscription, "Unsubscribed Successful"));
});

export { subscribe, unsubscribe };
