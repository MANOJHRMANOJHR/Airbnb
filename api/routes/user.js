const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require("path");
const { isLoggedIn } = require('../middlewares/user');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/Users')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix+'-'+ path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

const {
  auth,
  register,
  login,
  logout,
  googleLogin,
  uploadPicture,
  updateUserDetails,
} = require('../controllers/userController');

router.route('/auth').get(isLoggedIn , auth);
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/google/login').post(googleLogin)
router.route('/upload-picture').post(upload.single('picture', 1), uploadPicture)
router.route('/update-user').put(updateUserDetails)
router.route('/logout').get(logout);



module.exports = router;
