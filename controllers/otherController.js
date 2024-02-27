import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Stats } from "../models/Stats.js";
import { Course } from "../models/Course.js";
import { User } from "../models/User.js";
import redis_client from "../config/redis.js";

export const contact = catchAsyncError(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message)
    return next(new ErrorHandler("All fields are mandatory", 400));

  const to = process.env.MY_MAIL;
  const subject = "Contact from skillery";
  const text = `I am ${name} and my Email is ${email}. \n${message}`;

  await sendEmail(to, subject, text);

  res.status(200).json({
    success: true,
    message: "Your Message Has Been Sent.",
  });
});

export const courseRequest = catchAsyncError(async (req, res, next) => {
  const { name, email, course } = req.body;
  if (!name || !email || !course)
    return next(new ErrorHandler("All fields are mandatory", 400));

  const to = process.env.MY_MAIL;
  const subject = "Requesting for a course on skillery";
  const text = `I am ${name} and my Email is ${email}. \n${course}`;

  await sendEmail(to, subject, text);

  res.status(200).json({
    success: true,
    message: "Your Request Has Been Sent.",
  });
});

export const getDashboardStats = catchAsyncError(async (req, res, next) => {
  const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(12);

  const statsData = [];

  for (let i = 0; i < stats.length; i++) {
    statsData.unshift(stats[i]);
  }
  const requiredSize = 12 - stats.length;

  for (let i = 0; i < requiredSize; i++) {
    statsData.unshift({
      users: 0,
      subscription: 0,
      views: 0,
    });
  }

  const usersCount = statsData[11].users;
  const subscriptionCount = statsData[11].subscription;
  const viewsCount = statsData[11].views;

  let usersPercentage = 0,
    viewsPercentage = 0,
    subscriptionPercentage = 0;
  let usersProfit = true,
    viewsProfit = true,
    subscriptionProfit = true;

  if (statsData[10].users === 0) usersPercentage = usersCount * 100;
  if (statsData[10].views === 0) viewsPercentage = viewsCount * 100;
  if (statsData[10].subscription === 0)
    subscriptionPercentage = subscriptionCount * 100;
  else {
    const difference = {
      users: statsData[11].users - statsData[10].users,
      views: statsData[11].views - statsData[10].views,
      subscription: statsData[11].subscription - statsData[10].subscription,
    };

    usersPercentage = (difference.users / statsData[10].users) * 100;
    viewsPercentage = (difference.views / statsData[10].views) * 100;
    subscriptionPercentage =
      (difference.subscription / statsData[10].subscription) * 100;
    if (usersPercentage < 0) usersProfit = false;
    if (viewsPercentage < 0) viewsProfit = false;
    if (subscriptionPercentage < 0) subscriptionProfit = false;
  }

  await redis_client.setex("stats", 24*60*60, JSON.stringify(statsData));
  await redis_client.setex("usersCount", 24 * 60 * 60, usersCount);
  await redis_client.setex("subscriptionCount", 24 * 60 * 60, subscriptionCount);
  await redis_client.setex("viewsCount", 24 * 60 * 60, viewsCount);
  await redis_client.setex("subscriptionPercentage", 24 * 60 * 60, subscriptionPercentage);
  await redis_client.setex("viewsPercentage", 24 * 60 * 60, viewsPercentage);
  await redis_client.setex("usersPercentage", 24 * 60 * 60, usersPercentage);
  await redis_client.setex("subscriptionProfit", 24 * 60 * 60, subscriptionProfit);
  await redis_client.setex("viewsProfit", 24 * 60 * 60, viewsProfit);
  await redis_client.setex("usersProfit", 24 * 60 * 60, usersProfit);

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
});

export const getSubscribed = catchAsyncError(async (req, res, next) => {
  let curr_month_count = 0;
  let last_month_count = 0;
  const users = await User.find({});
  for (const user of users) {
    const courses = user.playlist;
    if (courses) {
      const promises = courses.map(async (item) => {
        const course = await Course.findOne({ _id: item.course });
        if (course && course.createdBy == req.user.name) {
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          lastMonth.setDate(5);

          const secondlastMonth = new Date();
          secondlastMonth.setMonth(secondlastMonth.getMonth() - 1);
          secondlastMonth.setDate(5);
          if (item.date > lastMonth) {
            curr_month_count++;
          } else if (item.date > secondlastMonth) {
            last_month_count++;
          }
        }
      });
      await Promise.all(promises);
    }
  }
  const count = curr_month_count - last_month_count;
  let percentage = 0;
  if (last_month_count == 0) {
    percentage = count * 100;
  } else {
    percentage = (count / last_month_count) * 100;
  }
  await redis_client.setex("subscribedCount", 24 * 60 * 60, count);
  await redis_client.setex("subscribedpercentage", 24 * 60 * 60, percentage);
  res.status(200).json({
    success: true,
    count,
    percentage,
  });
});
