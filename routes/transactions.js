const router = require("express").Router();
const bcrypt = require("bcryptjs");
const randomize = require("randomatic");
const Users = require("../Model/Users");
const Transactions = require("../Model/Transactions");

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

//WITHDRAW ACCOUNT
router.put(`/:id/withdrawFund`, async (req, res) => {
  try {
    await Users.findByIdAndUpdate(req.params.id, {
      $inc: req.body,
    });
    res.status(200).json(`🟢 Amount, Withdrawal Succesfull`);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// P2P TRANSFER
router.put(`/:id/transfer`, async (req, res) => {
  const senderId = req.body.sender_acctNumber;
  const receiverId = req.body.receiver_acctNumber;
  let amount = req.body.amount;

  try {
    const sender = await
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
