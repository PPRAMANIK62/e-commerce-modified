import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import createToken from "../utils/createToken.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create User
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please fill all the inputs.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) res.status(400).send("User already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      success: true,
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return ErrorHandler("Please enter email and password", 400);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      createToken(res, existingUser._id);

      res.status(201).json({
        success: true,
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
    } else {
      return ErrorHandler(res, "Invalid email or password", 401);
    }
  } else {
    return ErrorHandler(res, "Invalid email or password", 401);
  }
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httyOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// Get all users -- admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(201).json({
    success: true,
    users,
  });
});

// Current logged in user profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(201).json({
      success: true,
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    ErrorHandler(res, "User not found.", 404);
  }
});

// Update user profile
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    ErrorHandler(res, "User not found", 404);
  }
});

// Delete User -- admin
const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      ErrorHandler(res, "Cannot delete admin user", 400);
    }

    await User.deleteOne({ _id: user._id });
    res.status(200).json({
      success: true,
      message: "User removed",
    });
  } else {
    ErrorHandler(res, "User not found", 404);
  }
});

// Get User porfile -- admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json({
      success: true,
      user,
    });
  } else {
    ErrorHandler(res, "User not found", 404);
  }
});

// Update User profile -- admin
const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    ErrorHandler(res, "User not found", 404);
  }
});

export {
  createUser,
  deleteUserById,
  getAllUsers,
  getCurrentUserProfile,
  getUserById,
  loginUser,
  logoutUser,
  updateCurrentUserProfile,
  updateUserById,
};
