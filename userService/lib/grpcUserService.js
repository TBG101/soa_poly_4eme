import User from "../models/User.js";
import { isPasswordValid, isUserNameValid } from "./utils.js";
import jwt from "jsonwebtoken"; // added
import Bcrypt from "bcrypt"; // added

const GetUser = (call, callback) => {
  User.findById(call.request.id)
    .then((user) => {
      if (!user) return callback(new Error("User not found"));
      callback(null, { id: user.id, username: user.username });
    })
    .catch((err) => callback(err));
};

const CreateUser = (call, callback) => {
  const { username, password } = call.request;
  if (!isPasswordValid(password) && !isUserNameValid(username))
    return callback(new Error("Invalid username and password"));
  const user = new User({ username, password });

  user
    .save()
    .then((savedUser) => {
      // Optionally generate token immediately upon creation
      const token = jwt.sign(
        { id: savedUser.id, username: savedUser.username },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
      callback(null, {
        id: savedUser.id,
        username: savedUser.username,
        password: savedUser.password,
        token, // new field if desired
      });
    })
    .catch((err) => callback(err));
};

const UpdateUser = (call, callback) => {
  const { id, username, password } = call.request;
  User.findByIdAndUpdate(id, { username, password })
    .then((user) => {
      if (!user) return callback(new Error("User not found"));
      callback(null, { id: user.id, username: user.username });
    })
    .catch((err) => callback(err));
};

const DeleteUser = (call, callback) => {
  User.findByIdAndDelete(call.request.id)
    .then((user) => {
      if (!user) return callback(new Error("User not found"));
      callback(null, { id: user.id, username: user.username });
    })
    .catch((err) => callback(err));
};

// New login method to generate a JWT on valid credentials.
const Login = (call, callback) => {
  const { username, password } = call.request;
  User.findOne({ username })
    .then((user) => {
      // Check password & username validity
      if (Bcrypt.compareSync(password, user.password) === false && !user) {
        return callback(new Error("Invalid username or password"));
      }

      // Generate jwt token valid for 30d
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
      callback(null, { token });
    })
    .catch((err) => callback(err));
};

export const userMethods = {
  GetUser,
  CreateUser,
  UpdateUser,
  DeleteUser,
  Login,
};
