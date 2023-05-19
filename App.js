const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.post("/api/login", (req, res) => {
  const { Name, Password } = req.query;
  console.log("Name:", Name);
  console.log("Password:", Password);

  // You can perform any additional logic or database operations here

  res.send("Login request received");
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
