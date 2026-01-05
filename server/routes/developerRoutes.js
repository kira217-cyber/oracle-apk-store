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


export default router;
