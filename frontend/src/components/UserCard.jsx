import React from 'react';
import { Link } from 'react-router-dom';
import DateFormat from '../utils/FormatDate';

function UserCard({ currentUserId, userData, isFriend, hasSentRequest, onSendRequest }) {
    const { _id, user_id, username, createdAt } = userData;
    const isSelf = currentUserId === _id;

    if (!userData) {
        return null;
    }

    return (
        <div className="flex flex-col p-10 bg-gray-300 border">
            <h1 className="text-3xl">USER ID: {user_id}</h1>
            <h2 className="text-4xl">Username: {username}</h2>
            <h2 className="text-2xl">Created at: {DateFormat(createdAt)}</h2>

            <div className="text-xl text-blue-600">
                {isSelf ? (
                    <div className="flex gap-2 flex-col">
                        <p>HEY THAT IS YOU!</p>
                        <Link to="/profile" className="bg-blue-700 text-white w-1/4 text-center">
                            GO TO PROFILE!
                        </Link>
                    </div>
                ) : (
                    <div className={`text-xl mt-2 ${isFriend ? 'text-green-800' : 'text-red-700'}`}>
                        {isFriend ? (
                            <p>FRIENDED!</p>
                        ) : (
                            <div className="flex gap-2 flex-col">
                                <button
                                    className={`w-1/4 text-center text-white p-2 ${
                                        hasSentRequest
                                            ? 'bg-gray-500 cursor-default opacity-75'
                                            : 'bg-green-500 cursor-pointer'
                                    }`}
                                    disabled={hasSentRequest}
                                    onClick={
                                        hasSentRequest ? undefined : () => onSendRequest(user_id)
                                    }
                                >
                                    {hasSentRequest
                                        ? 'ALREADY SENT FRIEND REQUEST!'
                                        : 'ADD FRIEND'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserCard;
