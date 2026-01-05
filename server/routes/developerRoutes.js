// routes/developerRoutes.js
import express from "express";
import bcrypt from "bcrypt";
import Developer from "../models/Developer.js";

const router = express.Router();

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

    // check if email exists
    const exists = await Developer.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create developer
    const newDev = await Developer.create({
      firstName,
      lastName,
      email,
      accountType,
      companyName: accountType === "company" ? companyName : "",
      fullName: accountType === "individual" ? fullName : "",
      country,
      whatsapp,
      website,
      password: hashedPassword,
      role: "developer",
    });

    // return user info only (no password)
    res.json({
      message: "Registration Successful",
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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }

  try {
    const user = await Developer.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
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

// ==================== NEW GET APIs ====================

// GET ALL DEVELOPERS (Admin only - you can add auth middleware later)
router.get("/", async (req, res) => {
  try {
    const developers = await Developer.find({})
      .select("-password") // Exclude password
      .sort({ createdAt: -1 }); // Newest first

    const formattedDevelopers = developers.map(dev => ({
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
      createdAt: dev.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: formattedDevelopers.length,
      developers: formattedDevelopers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET SINGLE DEVELOPER BY ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const developer = await Developer.findById(id).select("-password");

    if (!developer) {
      return res.status(404).json({
        success: false,
        message: "Developer not found",
      });
    }

    const developerResponse = {
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
      createdAt: developer.createdAt,
    };

    res.status(200).json({
      success: true,
      developer: developerResponse,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid Developer ID" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;
