require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectWithDB = require("./config/db");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;
//the images uploaded in the cloud are accessible by a link

// connect with database
connectWithDB();

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// For handling cookies
app.use(cookieParser());

// Initialize cookie-session middleware
app.use(
  cookieSession({
    name: "session",
    maxAge: process.env.COOKIE_TIME * 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_SECRET],
   // secure: true, // Only send over HTTPS
   secure: false,
    sameSite: "none", // Allow cross-origin requests
    httpOnly: false, // Makes the cookie accessible only on the server-side
  })
);
/*Line 8*/

//MIDDLEWARE TO HANDLE FORM DATA 
app.use(express.urlencoded({extended: true}));


// middleware to handle json
app.use(express.json());
/* Line 4*/

// CORS
app.use(
  cors({
  //  origin: process.env.CLIENT_URL,
  origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // List all methods explicitly
    allowedHeaders: ["Content-Type", "Authorization"], // Optional: Add allowed headers
  })
);

// use express router as middleware 
app.use("/", require("./routes"));

app.listen(process.env.PORT || 8000, (err) => {
  if (err) {
    console.log("Error in connecting to server: ", err);
  }else{
  console.log(`Server is running on port no. ${(process.env.PORT || 8000)}`);
  }
  /* Line 5*/
});

module.exports = app;
