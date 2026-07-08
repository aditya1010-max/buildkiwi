import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, //for production back to 10
  message: {
    success: false,
    message: "Too many login attempts",
  },
});

//Future expansion ideas:

// Per User
// Per IP
// Per Route
