import express from "express";
import bcrypt from "bcryptjs"; // bcryptjs ইম্পোর্ট করুন
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // বেসিক ভ্যালিডেশন
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
    });
  }

  // অতিরিক্ত ভ্যালিডেশন (অপশনাল কিন্তু ভালো প্র্যাকটিস)
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  try {
    // ইমেইল দিয়ে চেক – আগে থেকে আছে কিনা
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // পাসওয়ার্ড হ্যাশ করা (bcryptjs দিয়ে)
    const salt = await bcrypt.genSalt(12); // 12 rounds – খুবই সিকিউর
    const hashedPassword = await bcrypt.hash(password, salt);

    // নতুন ইউজার তৈরি – হ্যাশ করা পাসওয়ার্ড সেভ হবে
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword, // এখানে হ্যাশ করা পাসওয়ার্ড
    });

    // সাকসেস রেসপন্স
    res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Registration Error:", err);

    // ডুপ্লিকেট ইমেইল এরর (MongoDB unique index)
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    // অন্যান্য এরর
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /api/users/profile
router.put("/profile", async (req, res) => {
  const { name, email, password, currentEmail } = req.body;

  try {
    // find user by current email (logged-in user)
    const user = await User.findOne({ email: currentEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // update name
    if (name) {
      user.name = name.trim();
    }

    // update email
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email.toLowerCase().trim();
    }

    // update password
    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// NEW: GET single user by ID (public info only)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "firstName lastName name email" // only send safe fields
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        name: user.name || "",
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Fetch User Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
