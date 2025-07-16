const { verifyToken } = require("@clerk/clerk-sdk-node");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await verifyToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
      name: `${payload.firstName} ${payload.lastName}`,
    };

    next();
  } catch (err) {
    console.error("❌ Clerk token verification failed:", err);
    return res.status(403).json({ message: "You are not authenticated" });
  }
};
