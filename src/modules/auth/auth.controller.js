const jwt = require("jsonwebtoken");
const tokenModel = require("../../../Database/models/tokenModel.js");
const userModel = require("../../../Database/models/user.model.js");
const bcryptjs = require("bcrypt");
const sendEmail = require("../../utils/sendEmail.js");
const signUpTemplate = require("../../utils/htmlTemplets.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const SignUp = async (req, res) => {
  try {
    // making sure that the used email dosent exist
    const isUser = await userModel.findOne({ email: req.body.email });
    if (isUser) {
      return First(res, "User already existed", 409, http.FAIL);
    }
    // hashing the password
    req.body.password = bcryptjs.hashSync(req.body.password, 5);
    // Creating the token
    const token = jwt.sign(
      { email: req.body.email, id: req.body._id },
      process.env.JWT_SECRET_KEY
    );
    // Creating the user
    const user = await userModel.create(req.body);
    const html = signUpTemplate(
      `http://localhost:3000/api/auth/activat_account/${token}`
    );
    const messageSent = await sendEmail({
      to: user.email,
      subject: "Account Activation",
      html,
    });
    if (!messageSent) {
      return First(res, "Failed to send activation email.", 400, http.FAIL);
    }
    Second(
      res,
      ["User Created , Pleasr activate your account", token],
      201,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const activeAccount = async (req, res) => {
  try {
    // receving the token from the params
    const { token } = req.params;
    // decoding the token to get the payload
    const payLoad = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Searching for the user in DataBase
    const isUser = await userModel.findOneAndUpdate(
      { email: payLoad.email },
      { confirmEmail: true },
      { new: true }
    );
    if (!isUser) {
      return First(res, "User not found.", 404, http.FAIL);
    }

    return Second(
      res,
      ["Account Activated , Try to login ", isUser],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const signIn = async (req, res) => {
  try {
    // distructing the req.body
    const { email, password } = req.body;
    // searching for the user in database
    const isUser = await userModel.findOne({ email });
    if (!isUser) {
      return First(res, "Invalid Email", 404, http.FAIL);
    }
    // making sure that the user has activated the account
    if (!isUser.confirmEmail) {
      return First(res, "Please Confirm your email", 400, http.FAIL);
    }
    // comparing the hashed password with the req.body password
    const match = await bcryptjs.compare(password, isUser.password);
    console.log(isUser);
    // sending a response if the passwords dosent match
    if (!match) {
      return First(res, "Invalid password", 400, http.FAIL);
    }
    // creating a token for using it in authentication and autorization
    const token = jwt.sign(
      { email, id: isUser._id },
      process.env.JWT_SECRET_KEY
    );
    // saving the token in token model (this an  optional  step)
    await tokenModel.create({ token, user: isUser._id });
    // sending the response
    return Second(res, ["you are loggedin", token], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const GetAllUser = async (req, res) => {
  try {
    const findUsers = await userModel.find();
    return Second(res, ["All Users", findUsers], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  SignUp,
  activeAccount,
  signIn,
  GetAllUser,
};
