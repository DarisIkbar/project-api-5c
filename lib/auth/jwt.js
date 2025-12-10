import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET;

export function signJWT(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "1d" });
}

export function verifyJWT(token) {
  return jwt.verify(token, SECRET);
}
