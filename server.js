const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db")
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 2000;

connectDB();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use("/api/user", userRoutes);

app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});