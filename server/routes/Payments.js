// Import the required modules
const express = require("express")
const router = express.Router()

const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payments")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
const lockDemoAccounts = require("../middlewares/lockDemoAccounts")
router.post("/capturePayment", auth, isStudent, lockDemoAccounts, capturePayment)
router.post("/verifyPayment",auth, isStudent, lockDemoAccounts, verifyPayment)
router.post("/sendPaymentSuccessEmail", auth, isStudent, lockDemoAccounts, sendPaymentSuccessEmail);

// Test enrollment route (no payment required)
router.post("/testEnroll", auth, isStudent, async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;
  if (!courseId) {
    return res.status(400).json({ success: false, message: "Course ID required" });
  }
  try {
    // Add user to course's studentsEnrolled
    await require("../models/Course").findByIdAndUpdate(
      courseId,
      { $addToSet: { studentsEnrolled: userId } }
    );
    // Add course to user's courses
    await require("../models/User").findByIdAndUpdate(
      userId,
      { $addToSet: { courses: courseId } }
    );
    return res.json({ success: true, message: "Enrolled without payment (test mode)" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router