import React, { useEffect } from 'react';
import { useFriend } from '../context/FriendContext';

import DateFormat from '../utils/FormatDate';
import { Link } from 'react-router-dom';

const Friends = () => {
    const { friends, fetchFriends } = useFriend();

    useEffect(() => {
        fetchFriends();
    }, [])


    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-5xl mx-auto">
                <div className="text-4xl p-4 flex justify-center items-center gap-3">
                    <Link to="/inbox" className="bg-gray-300">Inbox</Link>
                    <Link to="/sent" className="bg-gray-300">Sent</Link>
                </div>

                <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
                    FRIENDS LIST
                </h1>

                {
                    friends && friends.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {
                                friends.map(friend => (
                                    <div
                                        key={friend._id}
                                        className="bg-white p-6 shadow-md border"
                                    >
                                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{friend.username}</h2>
                                        <p className="text-gray-600 mb-1"><span className="font-medium">ROLE: </span>{friend.role}</p>
                                        <p className="text-gray-600 text-sm"> <span className="font-medium">USER ID: </span>{friend.user_id}</p>
                                        <p className="text-gray-600 text-sm"><span className="font-medium">REQUEST CREATED ON: </span>{DateFormat(friend.createdAt)}</p>
                                        <p className="text-gray-600 text-sm"><span className="font-medium">ADDED ON: </span>{DateFormat(friend.updatedAt)}</p>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className="text-center text-gray-600 text-lg">YOU HAVE NO FRIENDS</div>
                    )
                }
            </div>
        </div>
    );
};

export default Friends;
