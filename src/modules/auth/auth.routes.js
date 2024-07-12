const express = require("express");
const router = express.Router();
const { validation } = require("./../../middleware/validation.middleware.js");
const {
  SignUpSchema,
  activateAcountSchema,
  signInSchema,
} = require("./auth.validation.js");

const {
  SignUp,
  activeAccount,
  signIn,
  GetAllUser,
} = require("./auth.controller.js");

router.post("/SignUp", validation(SignUpSchema), SignUp);

router.get(
  "/activat_account/:token",
  validation(activateAcountSchema),
  activeAccount
);

router.post("/signIn", validation(signInSchema), signIn);

router.get("/", GetAllUser);

module.exports = router;
