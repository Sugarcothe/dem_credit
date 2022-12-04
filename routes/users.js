const router = require("express").Router();
const bcrypt = require("bcryptjs");
const randomize = require("randomatic");
const Users = require("../Model/Users");



// CREATE ACCOUNT
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
    const accountNumber = randomize("0", 10);
    

    //append accountNumber to req.body
    req.body.accountNumber = accountNumber;

    //     //check if the user already exist
    const userExist = await Users.findOne({ accountNumber });
    if (userExist)
      return res
        .status(400)
        .json({ message: "User already register, please login" });

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      //create a new User and save
      const newUser = await Users.create({
        accountNumber,
        username,
        email,
        password: hashedPassword
      });

      res.status(201).json({
        message: "🟢 New user created, welcome friend",
        user: {
          id: newUser._id,
          username: newUser.username,
          accountNumber: newUser.accountNumber,
        },
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: `🔴 Error while creating account: ${err}` });
    }
  
})

// LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const user = await Users.findOne({ accountNumber: req.body.accountNumber });
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

module.exports = router;
