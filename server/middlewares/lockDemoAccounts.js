const DEMO_EMAILS = [
  "demo@student.dev",
  "demo@instructor.dev"
];

function lockDemoAccounts(req, res, next) {
  // `req.user` is set by your existing JWT / auth middleware
  if (req.user && DEMO_EMAILS.includes(req.user.email)) {
    return res
      .status(403)
      .json({ success: false, message: "Demo account – this action is not allowed" });
  }
  next();
}

module.exports = lockDemoAccounts;
