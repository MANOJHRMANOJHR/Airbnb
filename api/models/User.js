const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token:{
     type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
    default: 'https://res.cloudinary.com/rahul4019/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1695133265/pngwing.com_zi4cre.png'
  }
});

/*
userSchema.pre("save", function(next) { ... })
It expects you to explicitly call next() to signal that:
Your logic is complete.
The save process can continue.
If you forget to call next(), Mongoose will:
Wait forever (because it thinks your middleware is still working).
The save operation will hang and never complete.

⚡ When can you skip next?
If you define the middleware function as:
userSchema.pre("save", async function() { ... })
Mongoose detects it’s an async function:
It automatically waits for the Promise to resolve.
You don’t need to call next(); just finish or return.
*/

/*
🔧 1. Middleware (hooks)
Middleware lets you run code automatically:
Before an action: e.g., pre("save"), pre("remove")
After an action: e.g., post("save"), post("find")

🛠 2. Custom methods
These are functions you attach to the schema, which become available
 on every instance (object) of that model.
*/

// encrypt password before saving it into the DB
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10)
})

// create and return jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  })
}

// validate the password
userSchema.methods.isValidatedPassword = async function (userSentPassword) {
  return await bcrypt.compare(userSentPassword, this.password)
}


const User = mongoose.model("User", userSchema);

module.exports = User;
