import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
    const [friends, setFriends] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [cancelFriendRequest, setCancelFriendRequest] = useState(null);
    const [acceptFriendRequest, setAcceptFriendRequest] = useState(null);
    const [friendError, setFriendError] = useState(null);


    const fetchFriends = async () => {
        try {
            const res = await axios.get("http://localhost:4200/api/friends/", {
                withCredentials: true,
            });
            setFriendError(null);
            setFriends(res.data.friends);
        } catch (err) {
            setFriends([]);
            setFriendError(err);
        }
    };

    const fetchAllReceivedRequests = async () => {
        try {
            const res = await axios.get("http://localhost:4200/api/friends/request/received", {
                withCredentials: true,
            });
            setFriendError(null);
            setReceivedRequests(res.data.received);
        } catch (err) {
            console.error(err);
            setReceivedRequests(err);
        }
    }

    const fetchSentRequest = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:4200/api/friends/request/sent/${userId}`, {
                withCredentials: true,
            });
            
            setFriendError(null);
            setSentRequests(res.data.sent);
        } catch (err) {
            console.error(err);
            setSentRequests(err);
        }
    }

    const fetchAllSentRequests = async () => {
        try {
            const res = await axios.get("http://localhost:4200/api/friends/request/sent", {
                withCredentials: true,
            });
            setFriendError(null);
            setSentRequests(res.data.sent);
        } catch (err) {
            console.error(err);
            setSentRequests(err);
        }
    }

    const cancelTargetFriendRequest = async (userId) => {
        try {
            const res = await axios.delete(`http://localhost:4200/api/friends/request/cancel/${userId}`, {
                withCredentials: true,
            })
            setCancelFriendRequest(res.data.cancel);
            setFriendError(null);
        } catch (err) {
            console.error(err);
            setCancelFriendRequest(err);
        }
    }

    const acceptTargetFriendRequest = async (userId) => {
        try {
            const res = await axios.post(`http://localhost:4200/api/friends/request/accept/${userId}`, {}, {
                withCredentials: true,
            })
            setAcceptFriendRequest(res.data.cancel);
            setFriendError(null);
        } catch (err) {
            console.error(err);
            setAcceptFriendRequest(err);
        }
    }

    const sendTargetFriendRequest = async (userId) => {
        try {
            const res = await axios.post(`http://localhost:4200/api/friends/request/${userId}`, {}, {
                withCredentials: true,
            })
            setSentRequests(res.data.sent);
            setFriendError(null);
        } catch (err) {
            console.error(err);
            setSentRequests(err);
        }
    }

    return (
        <FriendContext.Provider value={{
            friends,
            fetchFriends,
            fetchAllReceivedRequests,
            fetchAllSentRequests,
            cancelTargetFriendRequest,
            acceptTargetFriendRequest,
            sendTargetFriendRequest,
            receivedRequests,
            sentRequests,
            setSentRequests,
            friendError,
            fetchSentRequest,
        }}>
            {children}
        </FriendContext.Provider>
    );
};

export const useFriend = () => useContext(FriendContext);
