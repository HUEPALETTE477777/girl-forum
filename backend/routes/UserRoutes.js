const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  createUser, 
  deleteAllUsers, 
  getUserById, 
  loginUser, 
  logoutUser, 
  deleteUser, 
  getUserByToken,
  searchUserByUsername,
  patchUser,
} = require('../controllers/UserController');

const getUserFromToken = require('../middleware/AuthMiddleware.js'); 
const upload = require("../middleware/Multer.js")

router.get('/', getAllUsers);
router.get('/user', getUserFromToken, getUserByToken);
router.get('/user/:id', getUserById);

router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/user/search', getUserFromToken, searchUserByUsername);

router.delete('/delete', deleteAllUsers);
router.delete('/delete/:id', deleteUser);

router.patch('/user', getUserFromToken, upload.single("avatar"), patchUser);

module.exports = router;
