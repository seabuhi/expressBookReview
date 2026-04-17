const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
app.use(express.json());

app.use(session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

app.use("/customer/auth", function auth(req, res, next) {
  const token = req.session.token;
  if (!token) return res.status(401).json({ message: "Not logged in" });
  try {
    jwt.verify(token, "secret_key");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));