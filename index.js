const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");

// Routes
const authRoute = require("./routes/auth");
const documentRoute = require("./routes/document");
const documentEdoRoute = require("./routes/documentEdo");
const documentTemplateRoute = require("./routes/documentTemplate");

const app = express();
dotenv.config();
var upload = multer();

/* MongoDB Connection */
mongoose
  .connect(
    "mongodb+srv://alis-admin:alis-admin@alis.jwftoit.mongodb.net/?retryWrites=true&w=majority&appName=alis"
  )
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.options("*", cors());

// for parsing multi/form-data
app.use(upload.array());
app.use(express.static("public"));

// routes
app.use("/api/auth", authRoute);
app.use("/api/document", documentRoute);
app.use("/api/documentEdo", documentEdoRoute);
app.use("/api/documentTemplate", documentTemplateRoute);

app.listen(8800, () => {
  console.log("Backend server is running at port 8800!");
});
