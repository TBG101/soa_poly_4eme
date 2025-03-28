import jwt from "jsonwebtoken";

export function isUserNameValid(userName) {
  return userName.length >= 3;
}

export function isPasswordValid(password) {
  return password.length >= 8;
}

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}
