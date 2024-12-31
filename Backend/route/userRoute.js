const express = require('express');
const router = express.Router();

const { loginUser,registerUser,logoutUser,getOtherUser } = require('../controller/userController');
const isAuthenticate = require('../middleware/isAuthenticate');

router.post('/register', registerUser);
router.post('/login',loginUser)
router.get('/logout',logoutUser)
router.get("/getOtherUser",isAuthenticate,getOtherUser)
module.exports = router;
