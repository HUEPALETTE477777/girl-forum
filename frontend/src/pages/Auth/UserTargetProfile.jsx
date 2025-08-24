import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { useFriend } from '../../context/FriendContext';

import DateFormat from '../../utils/FormatDate';
import { Link } from 'react-router-dom';

const UserTargetProfile = () => {
    const { id } = useParams();
    const { viewedUserProfile, getViewingUserProfile } = useAuth();
    const { targetUserFriends, fetchTargetUserFriends } = useFriend();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            await getViewingUserProfile(id);
            await fetchTargetUserFriends(id);
        };

        loadData();
        setLoading(false);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
                LOADING PROFILE!
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
            {viewedUserProfile && (
                <div className="bg-white border-2 border-gray-300 p-6">
                    <div className="flex items-center gap-3">
                        {
                            viewedUserProfile.avatar && (
                                <a href={viewedUserProfile.avatar} target="_blank">
                                    <img
                                        src={viewedUserProfile.avatar}
                                        className="w-28 h-28 border-2 border-gray-300 object-cover"
                                    />
                                </a>
                            )
                        }
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Username: {viewedUserProfile.username}</h1>
                            <p className="text-gray-600">User ID: <span className="text-sm font-mono">{viewedUserProfile.user_id}</span></p>
                            <p className="text-gray-500 text-sm mt-1">
                                Account Created: {DateFormat(viewedUserProfile.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <h2 className="text-xl font-semibold mb-4 text-gray-800 mt-3">Friends</h2>
            {
                targetUserFriends && targetUserFriends.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {targetUserFriends.map((friend) => (
                            <Link
                                key={friend._id}
                                className="bg-blue-100 hover:bg-blue-200 p-4 border-2 cursor-pointer"
                                to={{
                                    pathname: `/profile/${friend.user_id}`,
                                }}
                            >
                                <a href={friend.avatar} target="_blank">
                                    <img
                                        src={friend.avatar}
                                        className="w-28 h-28 border-2 border-gray-300 object-cover"
                                    />
                                </a>
                                <h1 className="text-lg font-medium text-blue-900">Username: {friend.username}</h1>
                                <h1 className="text-lg font-medium text-blue-900">User ID: {friend.user_id}</h1>

                            </Link>
                        ))}
                    </div>
                ) : (<p className="text-gray-600">THIS USER HAS NO FRIENDS!</p>)
            }
        </div>

    );
};

export default UserTargetProfile;
