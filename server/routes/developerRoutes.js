// routes/developerRoutes.js
import express from "express";
import bcrypt from "bcrypt";
import Developer from "../models/Developer.js";
import { sendEmail } from "../config/email.js";

const router = express.Router();

// ===============================================
// 1. সবচেয়ে উপরে: Specific routes (যেগুলোতে কোনো dynamic :id নেই)
// ===============================================

// GET ALL DEVELOPERS WITH FILTER & SEARCH (Admin panel list)
router.get("/all", async (req, res) => {
  try {
    let { filter, search } = req.query;

    const query = {};

    // Filter by status (skip if "all" or empty)
    if (filter && filter !== "all" && filter.trim() !== "") {
      query.status = filter.trim();
    }

    // Search by name/email/company
    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { fullName: regex },
        { companyName: regex },
      ];
    }

    const developers = await Developer.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(developers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL DEVELOPERS (Simple list - if you still need it)
router.get("/", async (req, res) => {
  try {
    const developers = await Developer.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    const formatted = developers.map((dev) => ({
      id: dev._id,
      firstName: dev.firstName,
      lastName: dev.lastName,
      email: dev.email,
      accountType: dev.accountType,
      companyName: dev.companyName,
      fullName: dev.fullName,
      country: dev.country,
      whatsapp: dev.whatsapp,
      website: dev.website,
      role: dev.role,
      status: dev.status,
      createdAt: dev.createdAt,
    }));

    res.json({
      success: true,
      count: formatted.length,
      developers: formatted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ===============================================
// 2. তারপর: Parameterized routes (যেগুলোতে :id আছে)
// ===============================================

// GET SINGLE DEVELOPER BY ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: Extra validation
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Developer ID" });
    }

    const developer = await Developer.findById(id).select("-password");

    if (!developer) {
      return res
        .status(404)
        .json({ success: false, message: "Developer not found" });
    }

    res.json({
      success: true,
      developer: {
        id: developer._id,
        firstName: developer.firstName,
        lastName: developer.lastName,
        email: developer.email,
        accountType: developer.accountType,
        companyName: developer.companyName,
        fullName: developer.fullName,
        country: developer.country,
        whatsapp: developer.whatsapp,
        website: developer.website,
        role: developer.role,
        status: developer.status,
        createdAt: developer.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Developer ID" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// UPDATE DEVELOPER STATUS (Accept/Reject/Active/Deactive)
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;

    if (!["active", "deactive", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Extra safety: validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid Developer ID" });
    }

    const developer = await Developer.findById(id);
    if (!developer) {
      return res.status(404).json({ message: "Developer not found" });
    }

    developer.status = status;
    await developer.save();

    // Send email if message is provided
    if (message && message.trim()) {
      const subject = `Account Status Updated - ${
        status.charAt(0).toUpperCase() + status.slice(1)
      }`;
      await sendEmail(developer.email, subject, message.trim());
    }

    res.json({
      message: "Status updated successfully",
      developer: {
        id: developer._id,
        email: developer.email,
        status: developer.status,
      },
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid Developer ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// GET DETAILED VIEW OF SINGLE DEVELOPER (optional, if you want separate endpoint)
router.get("/details/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid Developer ID" });
    }

    const developer = await Developer.findById(id).select("-password");
    if (!developer) {
      return res.status(404).json({ message: "Developer not found" });
    }

    res.json(developer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================================
// 3. অন্যান্য রাউট (POST - Register & Login)
// ===============================================

// REGISTER DEVELOPER
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      accountType,
      companyName,
      fullName,
      country,
      whatsapp,
      website,
      password,
    } = req.body;

    const exists = await Developer.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDev = await Developer.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      accountType,
      companyName: accountType === "company" ? companyName?.trim() : "",
      fullName: accountType === "individual" ? fullName?.trim() : "",
      country,
      whatsapp,
      website: website?.trim() || "",
      password: hashedPassword,
      role: "developer",
      status: "active",
    });

    res.json({
      message:
        "Registration Successful. Your account is pending admin approval.",
      user: {
        id: newDev._id,
        firstName: newDev.firstName,
        lastName: newDev.lastName,
        email: newDev.email,
        role: newDev.role,
        accountType: newDev.accountType,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// LOGIN DEVELOPER
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password required" });
  }

  try {
    const user = await Developer.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    if (user.status !== "active") {
      let message = "Your account is not active.";
      if (user.status === "pending")
        message = "Your account is pending admin approval.";
      if (user.status === "rejected")
        message = "Your account has been rejected.";
      if (user.status === "deactive") message = "Your account is deactivated.";
      return res.status(403).json({ success: false, message });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        // Add more fields if needed
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
