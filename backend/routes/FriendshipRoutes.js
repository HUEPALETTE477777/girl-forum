const express = require('express');
const router = express.Router();

const {
    getAllFriends,
    getAllFriendsOfUser,
    sendFriendRequest,
    acceptFriendRequest,
    cancelFriendRequest,
    getAllReceivedFriendRequests,
    getAllSentFriendRequests,
    unfriendAllFriends,
    unfriendSingleFriend,
} = require("../controllers/FriendshipController")

// SUPER HANDY GET USER FROM TOKEN, ALL RELY ON USER
const getUserFromToken = require('../middleware/AuthMiddleware.js'); 

router.get("/", getUserFromToken, getAllFriends);
router.get("/:id", getUserFromToken, getAllFriendsOfUser)
router.get("/request/received", getUserFromToken, getAllReceivedFriendRequests)
router.get("/request/sent", getUserFromToken, getAllSentFriendRequests)

router.post("/request/:id", getUserFromToken, sendFriendRequest)
router.post("/request/accept/:id", getUserFromToken, acceptFriendRequest)

router.delete("/request/cancel/:id", getUserFromToken, cancelFriendRequest)
router.delete("/", getUserFromToken, unfriendAllFriends)
router.delete("/:id", getUserFromToken, unfriendSingleFriend);

module.exports = router;