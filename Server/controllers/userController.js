const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
const JWT = require("jsonwebtoken");

//Controllers

// resgister Controller

const registerController = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (phoneNumber.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be at least 10 characters long",
      });
    }

    //existing user

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    //hash password

    const hashedPassword = await hashPassword(password);

    //save user
    const user = await userModel({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    }).save();

    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error,
    });
  }
};

//login controller

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //existing user

    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    //compare password

    const isPasswordCorrect = await comparePassword(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    //token

    const token = await JWT.sign(
      { _id: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    existingUser.password = undefined;

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: existingUser,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error,
    });
  }
};

//update user controller

const updateUserController = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    //existing user

    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    if (password && password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    if (phoneNumber && phoneNumber.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be at least 10 characters long",
      });
    }

    //hash password

    const hashedPassword = password ? await hashPassword(password) : undefined;

    //update user
    const updateduser = await userModel.findByIdAndUpdate(
      existingUser._id,
      {
        name: name || existingUser.name,
        password: hashedPassword || existingUser.password,
        phoneNumber: phoneNumber || existingUser.phoneNumber,
      },
      { new: true }
    );
    updateduser.password = undefined;
    return res.status(200).json({
      success: true,
      message: "User updated successfully. ",
      updateduser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  updateUserController,
};
