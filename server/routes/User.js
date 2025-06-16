// routes/auth.js  ⬅️ CommonJS-only, ready to paste

// core
const express = require("express");
const router  = express.Router();

// middleware
const { auth }           = require("../middlewares/auth");           
const lockDemoAccounts   = require("../middlewares/lockDemoAccounts"); 

// controllers
const {
  login,
  signup,
  sendotp,
  changePassword,
} = require("../controllers/Auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

// ───────────────────────────────────────────────
// Authentication routes
// ───────────────────────────────────────────────

// basic auth
router.post("/login",  login);
router.post("/signup", signup);
router.post("/sendotp", sendotp);

// password change (only for logged-in users)
router.post(
  "/changepassword",
  auth,
  lockDemoAccounts,   // demo accounts cannot change password
  changePassword
);

// ───────────────────────────────────────────────
// Reset-password flow
// ───────────────────────────────────────────────
router.post("/reset-password-token", lockDemoAccounts, resetPasswordToken);
router.post("/reset-password",       lockDemoAccounts, resetPassword);

// export
module.exports = router;
