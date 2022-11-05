const router = require("express").Router();
const User = require("../Model/Users");
const bcrypt = require("bcryptjs");
const Users = require("../Model/Users");

// USER CREATE ACCOUNT
router.post("/signup", async (req, res) => {
  try {
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      accountNumber: req.body.accountNumber,
    });

    // save user and return response
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ accountNumber: req.body.accountNumber });
    !user && res.status(404).json("🔴 Account not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("🔴 Wrong Password");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ACCOUNT BALANCE
router.get("/:id/balance", async (req, res) => {
  try {
    const userInfo = await User.findById(req.params.id);
    res.status(200).json(`🟢 Your account balance is $${userInfo.balance}`);
  } catch (err) {
    res.status(500).json(err);
  }
});

// FUND ACCOUNT
router.put(`/:id/fundAccount`, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      $inc: req.body
    });
    res.status(200).json(`🟢 Account funded Succesfully`);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// P2P TRANSFER
router.put(`/:id/transfer`, async (req, res) => {
 
});

module.exports = router;
