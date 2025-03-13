const jwt = require("jsonwebtoken");

const secretKey = "jwtSuperSecretKey123";
const token = jwt.sign({ user: "admin" }, secretKey, { expiresIn: "1h" });

console.log("Generated Token:", token);
