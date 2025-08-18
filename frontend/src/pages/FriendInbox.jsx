import React, { useEffect } from 'react'

import { useFriend } from '../context/FriendContext'

import DateFormat from '../utils/FormatDate';

const FriendInbox = () => {
    const {
        fetchAllReceivedRequests,
        receivedRequests,
        cancelTargetFriendRequest,
        acceptTargetFriendRequest
    } = useFriend();

    useEffect(() => {
        fetchAllReceivedRequests();
        console.log(receivedRequests);
    }, [])


    const handleDecliningFriendRequest = async (passedUserId) => {
        try {
            await cancelTargetFriendRequest(passedUserId);
            await fetchAllReceivedRequests();
        } catch (err) {
            console.error(err);
        }
    }

    const handleAcceptingFriendRequest = async (passedUserId) => {
        try {
            await acceptTargetFriendRequest(passedUserId);
            await fetchAllReceivedRequests();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="min-h-screen flex items-center flex-col">
            <h1 className="p-6 text-4xl">INBOX FOR ALL RECEIVED FRIEND REQUESTS</h1>
            {
                receivedRequests && receivedRequests.length > 0 ? (
                    receivedRequests.map(req => (
                        <div key={req._id} className="p-5 bg-gray-200 border flex items-center gap-8">
                            <div>
                                <h1 className="text-3xl text-blue-600">{req.username} WANTS YOU!</h1>
                                <h1 className="text-3xl">FROM: {req.username}</h1>
                                <p className="text-2xl">ROLE: {req.role}</p>
                                <p className="text-2xl">USER ID: {req.user_id}</p>
                                <p>SENT AT: {DateFormat(req.updatedAt)}</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button className="bg-green-400 cursor-pointer p-4 hover:bg-green-700 transition hover:text-white" onClick={() => handleAcceptingFriendRequest(req.user_id)}>ACCEPT</button>
                                <button className="bg-red-400 cursor-pointer p-4 hover:bg-red-700 transition hover:text-white" onClick={() => handleDecliningFriendRequest(req.user_id)}>DECLINE</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <h1>NO RECEIVED FRIEND REQUESTS AT THIS TIME</h1>
                )
            }

        </div>
    )
}

export default FriendInbox
