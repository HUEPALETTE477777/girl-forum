import React, { useEffect, useState } from 'react';

import { useFriend } from '../../context/FriendContext';
import { useAuth } from '../../context/AuthContext';

import DateFormat from "../../utils/FormatDate";

const Sent = () => {
    const { sentRequests, fetchAllSentRequests, cancelTargetFriendRequest } = useFriend();
    const { user } = useAuth();
    const [visibleSentRequests, setVisibleSentRequests] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchAllSentRequests();
        };
        fetchData();
    }, []);


    useEffect(() => {
        if (Array.isArray(sentRequests)) {
            setVisibleSentRequests(sentRequests);
            console.log(sentRequests);
        }
    }, [sentRequests]);

    const cancelRequestHandler = async (userIdToCancel) => {
        try {
            await cancelTargetFriendRequest(userIdToCancel);
            setVisibleSentRequests(prev =>
                prev.filter(req => req.user_id !== userIdToCancel)
            );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center flex-col">
            <h1 className="text-center p-6 text-4xl">ALL OUTGOING/SENT REQUESTS</h1>
            <div className="flex gap-3">
                {
                    visibleSentRequests.length > 0 ? (
                        visibleSentRequests.map(req => (
                            <div key={req._id} className="bg-gray-300 p-4">
                                <h1>{req.username}</h1>
                                <h2>USER ID: {req.user_id}</h2>
                                <h3>SENT: {DateFormat(req.createdAt)}</h3>
                                <button
                                    onClick={() => cancelRequestHandler(req.user_id)}
                                    className="bg-red-500 text-white p-4 mt-2 cursor-pointer"
                                >
                                    CANCEL REQUEST
                                </button>
                            </div>
                        ))
                    ) : (
                        <h1>NO SENT REQUESTS</h1>
                    )
                }
            </div>
        </div>
    );
};

export default Sent;
