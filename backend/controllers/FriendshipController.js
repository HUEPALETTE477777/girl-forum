/* 
    NOT REALLY A CONTROLLER LOL SINCE IT IS ALL ABSTRACTED INTO
    ../utils/Friendship.js
    JULY 26 2025 FINISHED THIS TRASH GARBAGE
*/


const {
    findAllAcceptedFriendshipsForUser,
    findAllReceivedFriendRequestsForUser,
    findAllSentFriendRequestsForUser,
    deleteAllAcceptedFriendRequestsForUser,
    handleAllFriendRequests,
    handleSingleFriendRequest,
} = require("../utils/Friendship")

const {
    USER_KEYS,
    RESPONSE_KEYS,
    FRIENDSHIP_ACTIONS,
    SUCCESS_MESSAGES,
} = require("../utils/FriendshipConstants");

// GET /api/friends/
const getAllFriends = async (req, res) => {
    return handleAllFriendRequests(
        req, 
        res,
        findAllAcceptedFriendshipsForUser,
        USER_KEYS.FRIEND,
        RESPONSE_KEYS.FRIENDS,
        SUCCESS_MESSAGES.ALL_FRIENDS,
    )
};

// POST /api/friends/request/:id
const sendFriendRequest = async (req, res) => {
    return handleSingleFriendRequest(
        req, 
        res,
        FRIENDSHIP_ACTIONS.SEND,
        RESPONSE_KEYS.SENT,
        SUCCESS_MESSAGES.SENT_FRIEND_REQUEST,
    )
};

// POST /api/friends/accept/cancel/:id
const acceptFriendRequest = async (req, res) => {
    return handleSingleFriendRequest(
        req,
        res,
        FRIENDSHIP_ACTIONS.ACCEPT,
        RESPONSE_KEYS.FRIEND,
        SUCCESS_MESSAGES.NEW_FRIEND,
    )
};

// DELETE /api/friends/request/cancel/:id
const cancelFriendRequest = async (req, res) => {
    return handleSingleFriendRequest(
        req,
        res, 
        FRIENDSHIP_ACTIONS.CANCEL,
        RESPONSE_KEYS.CANCEL,
        SUCCESS_MESSAGES.CANCELED_FRIEND_REQUEST,
    )
};

// GET /api/friends/request/received
const getAllReceivedFriendRequests = async (req, res) => {
    return handleAllFriendRequests(
        req,
        res,
        findAllReceivedFriendRequestsForUser,
        USER_KEYS.REQUESTER,
        RESPONSE_KEYS.RECEIVED,
        SUCCESS_MESSAGES.ALL_RECEIVED_FRIEND_REQUESTS,
    )
};

// GET /api/friends/request/sent
const getAllSentFriendRequests = async (req, res) => {
    return handleAllFriendRequests(
        req,
        res,
        findAllSentFriendRequestsForUser,
        USER_KEYS.RECIPIENT,
        RESPONSE_KEYS.SENT,
        SUCCESS_MESSAGES.ALL_SENT_FRIEND_REQUESTS,
    )
}

// // GET /api/friends/request/sent/:id
// const getSentFriendRequest = async(req, res) => {
//     return await handleSingleFriendRequest(
//         req,
//         res,
//         FRIENDSHIP_ACTIONS.GET_SINGLE_SENT_FRIEND_REQUEST,
//         RESPONSE_KEYS.SENT,
//         SUCCESS_MESSAGES.RETRIEVED_SENT_FRIEND_REQUEST,
//     )
// }

// DELETE /api/friends/
const unfriendAllFriends = async (req, res) => {
    return handleAllFriendRequests(
        req,
        res,
        deleteAllAcceptedFriendRequestsForUser,
        USER_KEYS.FRIEND,
        RESPONSE_KEYS.UNFRIENDED,
        SUCCESS_MESSAGES.UNFRIENDED_ALL_FRIENDS,
    )
};

// DELETE /api/friends/:id
const unfriendSingleFriend = async (req, res) => {
    return await handleSingleFriendRequest(
        req,
        res,
        FRIENDSHIP_ACTIONS.UNFRIEND,
        RESPONSE_KEYS.UNFRIENDED,
        SUCCESS_MESSAGES.UNFRIENDED_FRIEND,
    )
};

module.exports = {
    getAllFriends,
    sendFriendRequest,
    acceptFriendRequest,
    cancelFriendRequest,
    getAllReceivedFriendRequests,
    getAllSentFriendRequests,
    unfriendAllFriends,
    unfriendSingleFriend,
};
