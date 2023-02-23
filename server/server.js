const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5001;
const connectDB = require("./db/db");
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/auth/", require("./routes/auth"));
app.use("/api/client/", require("./routes/client"));
app.use("/api/company/", require("./routes/company"));
app.use("/api/issue/", require("./routes/issue"));
app.use("/api/project/", require("./routes/project"));

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(PORT, () => console.log(`Server started at Port ${PORT}`));
