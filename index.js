const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const usersRoute = require('./routes/users')
const app = express();

// const crypto = require("crypto");

// const id = crypto.randomBytes(3).toString("hex");

// console.log(id);


dotenv.config();

app.use(express.json());
app.use("/api/users", usersRoute);
mongoose.connect(process.env.MONGO_DB, (err) => {
  if (err) {
    console.log(`🔴 BACKEND IS NOT CONNECTED ${err}`);
  } else {
    console.log(`🟢 CONNECTED TO MONGODB`);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🟢 Server listening on port ${process.env.PORT}`);
});
