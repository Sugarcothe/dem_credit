const router = require("express").Router();
const bcrypt = require("bcryptjs");
const randomize = require("randomatic");
const Users = require("../Model/Users");
const Transaction = require("../Model/Transactions");

// ACCOUNT BALANCE
router.get("/:id/balance", async (req, res) => {
  try {
    const userInfo = await Users.findById(req.params.id);
    res.status(200).json(`🟢 Your account balance is $${userInfo.balance}`);
  } catch (err) {
    res.status(500).json(err);
  }
});

// FUND ACCOUNT
router.put(`/:id/fundAccount`, async (req, res) => {
  try {
    await Users.findByIdAndUpdate(req.params.id, {
      $inc: req.body,
    });
    res.status(200).json(`🟢 Account funded Succesfully`);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// P2P TRANSFER
router.put(`/:id/transfer`, async (req, res) => {
  const senderId = req.body.sender_walletId;
  const receiverId = req.body.receiver_walletId;
  let amount = req.body.amount;
  const pin = req.body.pin;

  if (senderId === receiverId)
    return res.status(400).json({ message: "Cannot transfer to same account" });

  //verify that the the ids exist
  const sender = await User.findOne({ walletId: senderId });
  const receiver = await User.findOne({ walletId: receiverId });

  if (!sender || !receiver)
    return res.status(400).json({ message: "Invalid sender or receiver Id" });

  //validate pin
  const isMatch = await bcrypt.compare(pin, sender.pin);

  //ensure sender has enough balance to make this transaction
  let senderBalance = sender.balance;
  if (isMatch && senderBalance >= amount) {
    //send otp
    sendOtp({
      walletId: senderId,
      phoneNumber: sender.phoneNumber,
    });
    //save the unfulfilled transaction to transaction table
    const transactionDetails = await Transaction.create({
      sender_walletId: senderId,
      receiver_walletId: receiverId,
      amount,
    });

    res.status(200).json({
      message:
        "Please enter the otp sent to your mobile number to complete this transaction",
      transactionDetails,
    });
  } else {
    res.status(400).json({
      message: "You don't have enough funds to complete this transaction",
    });
  }
});

module.exports = router;