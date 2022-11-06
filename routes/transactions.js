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
  const senderId = req.body.sender_acctNumber;
  const receiverId = req.body.receiver_acctNumber;
  let amount = req.body.amount;

  if (senderId === receiverId)
    return res.status(400).json({ message: "Cannot transfer to same account" });

  //verify that the the ids exist
  const sender = await Users.findOne({ accountNumber: senderId });
  const receiver = await Users.findOne({ accountNumber: receiverId });

  if (!sender || !receiver)
    return res.status(400).json({ message: "Invalid sender or receiver Id" });

  //ensure sender has enough balance to make this transaction
  let senderBalance = sender.balance;
  if (senderBalance >= amount) {
    //save the unfulfilled transaction to transaction table
    const transactionDetails = await Transaction.create({
      sender_acctNumber: senderId,
      receiver_acctNumber: receiverId,
      amount,
    });

    res.status(200).json({
      message: "🟢 Transaction successful...",
      transactionDetails,
    });
  } else {
    res.status(400).json({
      message: "You don't have enough funds to complete this transaction",
    });
  }



  
});

module.exports = router;
