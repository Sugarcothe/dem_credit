const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const usersRoute = require("./routes/users");
const transactionsRoute = require("./routes/transactions");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();

// const crypto = require("crypto");

// const id = crypto.randomBytes(3).toString("hex");

// console.log(id);

dotenv.config();
app.use(express.json());
app.use(morgan("common"));
app.use(helmet());

// Route Endpoints
app.use("/api/users", usersRoute);
app.use("/api/transactions", transactionsRoute);

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
