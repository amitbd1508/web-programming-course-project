const express = require("express");
const cors = require("cors");

const {verifyUserToken} = require("./middleware/auth");

const authRouter = require("./routes/authRouter");
const router = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/api/v1", verifyUserToken, router);

app.use((req, res, next) => {
  res.status(404).json({ error: req.url + " API not supported!" });
});

app.use((err, req, res, next) => {
  if (err.message === "NOT Found") {
    res.status(404).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Something is wrong! Try later" });
  }
});

app.listen(3000, () => console.log("listening to 3000..."));
