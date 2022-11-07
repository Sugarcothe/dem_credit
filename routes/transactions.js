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
  // request for both the account of the sender/receriver/amount
  const senderAcct = req.body.accountNumber;
  const receiverAcct = req.body.accountNumber;
  let amount = req.body.amount;

  //   checks if the sending is sending to his account
  if (senderAcct === receiverAcct)
    return res.status(400).json({ message: "Cannot transfer to same account" });

  //verify that the the account number exist
  const sender = await Users.findOne({ accountNumber: senderAcct });
  const receiver = await Users.findOne({ accountNumber: receiverAcct });

  if (!sender || !receiver)
    return res.status(400).json({ message: "Invalid sender or receiver Id" });

  //ensure sender has enough balance to make this transaction
  let senderBalance = sender.balance;
  let receiverBalance = receiver.balance;

//   checks if sender have enough balance to send
  if (senderBalance >= amount) {
    //save the unfulfilled transaction to transaction amount
    const transactionDetails = await Users.create({
      senderAcct: senderAcct,
      receiverAcct: receiverAcct,
      amount,
    });

    if (senderBalance >= amount) {
      senderBalance -= amount;
      receiverBalance += amount;

      await Users.findOneAndUpdate(
        { senderAcct: Users.accountNumber },
        { balance: senderBalance }
      );
      await Users.findOneAndUpdate(
        { receiverAcct: Users.accountNumber },
        { balance: receiverBalance }
      );
      await Users.findOneAndUpdate({ status: "completed" });
      res.status(200).json({
        message: "🟢 Transaction successful...",
        transactionDetails,
      });
    } else {
      return res.status(400).json({ message: "Insufficient balance" });
    }
  } else {
    res.status(400).json({
      message: "You don't have enough funds to complete this transaction",
    });
  }
});

module.exports = router;
