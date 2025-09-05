const User = require('../models/User');
const cookieToken = require('../utils/cookieToken');
const bcrypt = require('bcryptjs')
const cloudinary = require('cloudinary').v2;

//Auth
exports.auth = async (req, res) => {
const user = req.user;
    if (!user) {
       console.log("user not in the mongodb");
      return res
        .status(401)
        .json({ error: 'You are not authorized ' });
    }
    console.log("success");
 return res.status(200).json({
        user,
        token: user.token
      });
};


// Register/SignUp user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required',
      });
    }

    // check if user is already registered
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: 'User already registered!',
      });
    }
  const token = user.getJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // makes the token available only to backend
        //secure: true,   // Only send over HTTPS
         secure: false,// no need of https
        sameSite: 'none' // Allow cross-origin requests
    };


    user = await User.create({
      name,
      email,
      token,
      password,
    });

    // after creating new user in DB send the token
    cookieToken(user, res, token , options);
  } catch (err) {
    res.status(500).json({
      message: 'Internal server Error',
      error: err,
    });
  }
};

// Login/SignIn user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check for presence of email and password
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required!',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'User does not exist!',
      });
    }

    // match the password
    const isPasswordCorrect = await user.isValidatedPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Email or password is incorrect!',
      });
    }
    const token = user.getJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // makes the token available only to backend
        //secure: true,   // Only send over HTTPS
         secure: false,// no need of https
        sameSite: 'none' // Allow cross-origin requests
    };

    // if everything is fine we will send the token
    cookieToken(user, res, token, options);
  } catch (err) {
    res.status(500).json({
      message: 'Internal server Error',
      error: err,
    });
  }
};

// Google Login
exports.googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: 'Name and email are required'
      })
    }

    // check if user already registered
    let user = await User.findOne({ email });

const token = user.getJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // makes the token available only to backend
        //secure: true,   // Only send over HTTPS
         secure: false,// no need of https
        sameSite: 'none' // Allow cross-origin requests
    };



    // If the user does not exist, create a new user in the DB  
    if (!user) {
      user = await User.create({
        name,
        email,
        token,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10)
      })
    }

    // send the token
    cookieToken(user, res,token, options);
  } catch (err) {
    res.status(500).json({
      message: 'Internal server Error',
      error: err,
    });
  }
}

// Upload picture
exports.uploadPicture = async (req, res) => {
  const { path } = req.file
  try {
    let result = await cloudinary.uploader.upload(path, {
      folder: 'Airbnb/Users',
    });
    //images or files uploaded in the cloudinary will be accessible through the internet and that http url is result.secure_url
    res.status(200).json(result.secure_url)
  } catch (error) {
    res.status(500).json({
      error,
      message: 'Internal server while uploading to cloudinary error',
    });
  }
  

}

// update user
exports.updateUserDetails = async (req, res) => {
  try {
    const { name, password, email, picture } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    // user can update only name, only password,only profile pic or all three

    user.name = name
    if (picture && !password) {
      user.picture = picture
    } else if (password && !picture) {
      user.password = password
    } else {
      user.picture = picture
      user.password = password
    }
  const token = user.getJwtToken();
  user.token = token;

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // makes the token available only to backend
        //secure: true,   // Only send over HTTPS
         secure: false,// no need of https
        sameSite: 'none' // Allow cross-origin requests
    };


    const updatedUser = await user.save()
    cookieToken(updatedUser, res, token, options);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" , error})
  }
}

// Logout
exports.logout = async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: false,// no need of https
   // secure: true,   // Only send over HTTPS
    sameSite: 'none' // Allow cross-origin requests
  });
  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
};
