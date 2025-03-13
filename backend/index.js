const express = require("express");
const app = express();
const cors = require("cors");
const connectionDB = require("./config/db.js");
const TaskRoute = require("./Routes/TaskRoute");
const AdminRoute = require("./Routes/AdminRoute");
// Connect to DB
connectionDB();

// CORS Configuration
const corsoptions = {
  origin:["http://localhost:3000","https://mern-demo-backend-tan.vercel.app"],
  methods: "GET,HEAD,PUT,POST,DELETE",
  credentials: true,
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 204,
};
app.use(cors(corsoptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Routes
app.use("/api", TaskRoute);
app.use("/api", AdminRoute);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
