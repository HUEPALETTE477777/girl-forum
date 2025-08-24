const User = require("../models/UserSchema");
const Friendship = require("../models/FriendshipSchema");

const { USER_KEYS, FRIENDSHIP_ACTIONS, STATUS, ERROR_MESSAGES } = require("./FriendshipConstants")

const USER_POPULATION_VALUE = 'username user_id role avatar createdAt';

const getUserByUID = async (userId) => {
    return await User.findOne({ user_id: userId });
};

// HANDLES REQUESTER/RECIPIENT SWAPPING CASES
const findFriendship = async (user1, user2, status) => {
    const query = {
        $or: [
            { [USER_KEYS.REQUESTER]: user1._id, [USER_KEYS.RECIPIENT]: user2._id },
            { [USER_KEYS.REQUESTER]: user2._id, [USER_KEYS.RECIPIENT]: user1._id }
        ]
    };

    if (status) {
        query.status = status;
    }

    return await Friendship.findOne(query).populate(`${USER_KEYS.REQUESTER} ${USER_KEYS.RECIPIENT}`, USER_POPULATION_VALUE);
};

const findSpecificUserKeyFriendship = async (user1, user2, status) => {
    const query = {
        [USER_KEYS.REQUESTER]: user1._id, [USER_KEYS.RECIPIENT]: user2._id,
    };

    if (status) {
        query.status = status;
    }

    return await Friendship.findOne(query).populate(`${USER_KEYS.REQUESTER} ${USER_KEYS.RECIPIENT}`, USER_POPULATION_VALUE);
};


const findAllAcceptedFriendshipsForUser = async (userId) => {
    return await Friendship.find({
        status: STATUS.ACCEPTED,
        $or: [
            { [USER_KEYS.REQUESTER]: userId },
            { [USER_KEYS.RECIPIENT]: userId },
        ]
    }).populate(`${USER_KEYS.REQUESTER} ${USER_KEYS.RECIPIENT}`, USER_POPULATION_VALUE);
};

const findAllReceivedFriendRequestsForUser = async (userId) => {
    return await Friendship.find({
        [USER_KEYS.RECIPIENT]: userId,
        status: STATUS.PENDING,
    }).populate(`${USER_KEYS.REQUESTER}`, USER_POPULATION_VALUE);
}

const findAllSentFriendRequestsForUser = async (userId) => {
    return await Friendship.find({
        [USER_KEYS.REQUESTER]: userId,
        status: STATUS.PENDING,
    }).populate(`${USER_KEYS.RECIPIENT}`, USER_POPULATION_VALUE);
}

const deleteAllAcceptedFriendRequestsForUser = async (userId) => {
    const friendships = await findAllAcceptedFriendshipsForUser(userId);
    await Friendship.deleteMany({
        _id: {
            $in: friendships.map(f => f._id) // SEX LINE, TAKES FRIENDSHIPS AS AN ARRAY WITH _id
        }
    });

    return friendships;
}

// NESTED RETURN WITH BRACES, I HATE THE IMPLICIT PARENTHETICALS
const requestMappingAll = (requests, userKey, userObjId) => {
    return requests.map(req => {
        let user;

        if (userKey === USER_KEYS.REQUESTER || userKey === USER_KEYS.RECIPIENT) {
            user = req[userKey];
        }

        if (userKey === USER_KEYS.FRIEND) {
            const requesterOID = req.requester._id.toString();
            const recipientOID = req.recipient._id.toString();
            const userOID = userObjId.toString();

            if (userOID === requesterOID) {
                user = req.recipient;
            }

            if (userOID === recipientOID) {
                user = req.requester;
            }
        }

        // IMPORTANT PAYLOAD MAPPING!
        return {
            _id: user._id,
            user_id: user.user_id,
            username: user.username,
            role: user.role,
            avatar: user?.avatar,

            createdAt: req.createdAt,
            updatedAt: req.updatedAt,
            status: req.status,
        };

    });
};

/*
    BEAUTIFUL HANDLER ALL FRIEND REQ ABSTRACTION HERE!!!

    findRequestType MEANS A FUNCTION for 'findAllReceivingFriendRequestsForUser' or 
    'findAllSentFriendRequestsForUser', FUNCTIONS ARE FOUND ABOVE LOL. TOO LAZY TO REFACTOR
    THEM AS WELL

    userKey MEANS 'recipient' OR 'requester'

    responseKey is 'sent' or 'received'
*/

const handleAllFriendRequests = async (req, res, findRequestType, userKey, responseKey, successMessage, user_id) => {
    try {
        const user = await getUserByUID(user_id);
        if (!user) {
            return res.status(404).json(ERROR_MESSAGES.NOT_FOUND_USER_KEY);
        }

        const requests = await findRequestType(req.user._id);

        const result = requestMappingAll(requests, userKey, user._id);

        res.status(200).json({
            message: successMessage,
            user: {
                user_id: user.user_id,
                username: user.username,
                role: user.role,
            }, 
            [responseKey]: result,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(ERROR_MESSAGES.UNCAUGHT_SERVER_ERROR);
    }
}

// ONLY DIFFERENCE IS OMITTING A USER KEY (RECIP.. REQ..)
const handleSingleFriendRequest = async (req, res, action, responseKey, successMessage) => {
    try {
        const requesterUID = req.user.user_id;
        const recipientUID = parseInt(req.params.id);

        if (requesterUID === recipientUID) {
            return res.status(400).json(ERROR_MESSAGES.ACTION_ON_ITSELF);
        }

        const requester = await getUserByUID(requesterUID);
        const recipient = await getUserByUID(recipientUID);

        if (!requester || !recipient) {
            return res.status(404).json(ERROR_MESSAGES.NOT_FOUND_USER_KEY);
        }

        let friendship = await findFriendship(requester, recipient);

        switch (action) {
            case FRIENDSHIP_ACTIONS.SEND:
                if (friendship) {
                    return res.status(400).json(ERROR_MESSAGES.FRIENDSHIP_EXISTS);
                }

                friendship = new Friendship({
                    requester,
                    recipient,
                    status: STATUS.PENDING,
                });

                await friendship.save();
                break;

            case FRIENDSHIP_ACTIONS.CANCEL:
                if (!friendship || friendship.status !== STATUS.PENDING) {
                    return res.status(404).json(ERROR_MESSAGES.NOT_FOUND_CANCEL);
                }
                const canceledData = {
                    requester: friendship.requester,
                    recipient: friendship.recipient,
                    status: friendship.status,
                    canceledAt: new Date(),
                };

                await friendship.deleteOne();

                return res.status(200).json({ message: successMessage, [responseKey]: canceledData });

            case FRIENDSHIP_ACTIONS.ACCEPT:
                if (!friendship || friendship.status !== STATUS.PENDING) {
                    return res.status(404).json(ERROR_MESSAGES.ACCEPT);
                }
                friendship.status = STATUS.ACCEPTED;
                await friendship.save();
                break;

            case FRIENDSHIP_ACTIONS.UNFRIEND:
                if (!friendship || friendship.status !== STATUS.ACCEPTED) {
                    return res.status(404).json(ERROR_MESSAGES.NOT_FOUND_UNFRIEND);
                }
                await friendship.deleteOne();
                break;
            
            case FRIENDSHIP_ACTIONS.GET_SINGLE_SENT_FRIEND_REQUEST:
                const targetFriendship = await findSpecificUserKeyFriendship(requester, recipient);
                return res.status(200).json({ message: successMessage, [responseKey]: targetFriendship });
                
            default:
                return res.status(400).json(ERROR_MESSAGES.INVALID_ACTION);
        }

        res.status(200).json({ message: successMessage, [responseKey]: friendship });
    } catch (err) {
        console.error(err);
        res.status(500).json(ERROR_MESSAGES.UNCAUGHT_SERVER_ERROR);
    }
};


module.exports = {
    getUserByUID,
    findFriendship,
    findAllAcceptedFriendshipsForUser,
    findAllReceivedFriendRequestsForUser,
    findAllSentFriendRequestsForUser,
    deleteAllAcceptedFriendRequestsForUser,
    requestMappingAll,
    handleAllFriendRequests,
    handleSingleFriendRequest,
};
