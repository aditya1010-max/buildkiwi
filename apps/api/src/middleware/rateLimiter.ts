import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log("RATE LIMIT HIT:", req.method, req.originalUrl);

    res.status(429).json({
      success: false,
      message: "Rate limited",
    });
  },
});

//Future expansion ideas:

// Per User
// Per IP
// Per Route
