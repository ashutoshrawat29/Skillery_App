import redis_client from "../config/redis.js";
import { catchAsyncError } from "./catchAsyncError.js";

export const isSubscribedCountPresent = catchAsyncError(
  async (req, res, next) => {
    let count = null,
      percentage = null;
    await redis_client.get("subscribedCount", (err, data) => {
      if (err) throw err;
      count = data;
    });
    await redis_client.get("subscribedpercentage", (err, data) => {
      if (err) throw err;
      percentage = data;
    });
    if (count != null && percentage != null) {
      res.status(200).json({
        success: true,
        count,
        percentage,
      });
    }
    else {
      next();
    }
  }
);

export const isStatsDataPresent = catchAsyncError(async (req, res, next) => {
  await redis_client.get("stats", (err, data) => {
    if (err) throw err;
    statsData = JSON.parse(data);
  });
  await redis_client.get("usersCount", (err, data) => {
    if (err) throw err;
    usersCount = data;
  });
  await redis_client.get("subscriptionCount", (err, data) => {
    if (err) throw err;
    subscriptionCount = data;
  });
  await redis_client.get("viewsCount", (err, data) => {
    if (err) throw err;
    viewsCount = data;
  });
  await redis_client.get("subscriptionPercentage", (err, data) => {
    if (err) throw err;
    subscriptionPercentage = data;
  });
  await redis_client.get("viewsPercentage", (err, data) => {
    if (err) throw err;
    viewsPercentage = data;
  });
  await redis_client.get("usersPercentage", (err, data) => {
    if (err) throw err;
    usersPercentage = data;
  });
  await redis_client.get("subscriptionProfit", (err, data) => {
    if (err) throw err;
    subscriptionProfit = data;
  });
  await redis_client.get("viewsProfit", (err, data) => {
    if (err) throw err;
    viewsProfit = data;
  });
  await redis_client.get("usersProfit", (err, data) => {
    if (err) throw err;
    usersProfit = data;
  });
  if (
    statsData &&
    usersCount &&
    subscriptionCount &&
    viewsCount &&
    subscriptionPercentage &&
    viewsPercentage &&
    usersPercentage &&
    subscriptionProfit &&
    viewsProfit &&
    usersProfit
  ) {
    res.status(200).json({
      success: true,
      stats: statsData,
      usersCount,
      subscriptionCount,
      viewsCount,
      subscriptionPercentage,
      viewsPercentage,
      usersPercentage,
      subscriptionProfit,
      viewsProfit,
      usersProfit,
    });
  }
  else {
    next();
  }
});
