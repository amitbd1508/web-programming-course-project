const express = require("express");
const cors = require("cors");
const path = require('path');

const Product = require('./models/product')
const {verifyUserToken} = require("./middleware/auth");

const authRouter = require("./routes/authRouter");
const router = require("./routes");

const products = require('./assets/data/products.json');
Product.insertAll(products);

const app = express();
const PORT = process.env.PORT || 3000

app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'assets', 'images')))

app.use("/auth", authRouter);
app.use("/api/v1", verifyUserToken, router);

app.use((req, res, next) => {
  res.status(404).json({ error: true, message: req.url + " API not supported!" });
});

app.use((err, req, res, next) => {
  if (err.message === "NOT Found") {
    res.status(404).json({ error: err.message });
  } else {
    res.status(500).json({ error: true, message: "Something is wrong! Try later" });
  }
});

app.listen(PORT, () => console.log("listening to 3000..."));
