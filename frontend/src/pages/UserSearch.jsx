import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFriend } from '../context/FriendContext';
import errorHandler from '../utils/ErrorHandler';
import UserCard from '../components/UserCard';

const UserSearch = () => {
    const { user, searchedUser } = useAuth();
    const {
        friends = [],
        sentRequests = [],
        fetchFriends,
        sendTargetFriendRequest,
        fetchAllSentRequests,
        setSentRequests,
    } = useFriend();

    const [localSentRequests, setLocalSentRequests] = useState([]);

    useEffect(() => {
        fetchAllSentRequests();
        fetchFriends();
    }, []);

    useEffect(() => {
        if (Array.isArray(sentRequests)) {
            setLocalSentRequests(sentRequests.map(req => req.user_id));
        }
    }, [sentRequests]);

    const sendFriendRequestHandler = async (targetUserId) => {
        try {
            await sendTargetFriendRequest(targetUserId);
            setLocalSentRequests(prev => [...prev, targetUserId]);
        } catch (err) {
            console.error(err);
        }
    };

    const isArray = (input) => { return Array.isArray(input); }
    if (!searchedUser || searchedUser.length === 0) { return errorHandler(); }

    const renderUserCard = (searched, isFriend, hasSent) => {
        return (
            <UserCard
                key={searched._id}
                currentUserId={user?._id}
                userData={searched}
                isFriend={isFriend}
                hasSentRequest={hasSent}
                onSendRequest={sendFriendRequestHandler}
            />
        );
    }

    return (
        <>
            <h1 className="text-center text-4xl m-10">SEARCH RESULTS:</h1>
            {searchedUser.map((searched) => {
                const isFriend = isArray(friends) && friends.some(friend => friend._id === searched._id);
                const hasSent = localSentRequests.includes(searched.user_id);

                return renderUserCard(searched, isFriend, hasSent)
            })}
        </>
    );
};

export default UserSearch;
