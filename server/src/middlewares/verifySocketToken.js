import jwt from "jsonwebtoken";

const verifySocketToken = (socket, next) => {

  const rawCookies = socket.handshake.headers.cookie;

  if (!rawCookies) {
    return next(new Error("Socket Auth Error: No cookies found"));
  }

  const token = rawCookies.split('token=')[1]?.split(';')[0];

  if (!token) {
    return next(new Error("Socket Auth Error: Token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error("Socket Auth Error: Invalid Token"));
  }
};

export { verifySocketToken };