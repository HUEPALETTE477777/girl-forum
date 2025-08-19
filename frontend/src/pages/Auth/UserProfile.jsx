import React, { useEffect } from 'react'

import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

import DateFormat from '../../utils/FormatDate';

const UserProfile = () => {
    const { user } = useAuth();

    // asdasd

    return (
        <div className="text-center">
            {
                user ? (
                    <div className="flex flex-col gap-2.5 p-12 bg-gray-300">
                        <h1 className="text-4xl">Welcome! {user.username}</h1>
                        <p className="text-3xl">USER ID: {user.user_id}</p>
                        <p>Account Creation: {DateFormat(user.createdAt)}</p>
                        <Link to="/profile/update" className="bg-red-400 p-4 text-white">update user</Link>
                        <Link to="/posts/create"  className="bg-green-400 p-4 text-white">create a post</Link>
                        <Link to="/friends"  className="bg-gray-400 p-4">view friends</Link>
                    </div>
                ) : (
                    <div className="flex flex-col items-center p-12">
                        <h1 className="text-6xl text-red-700">ILLEGAL IMMIGRANT! LOGIN TO GET PROFILE</h1>
                        <Link to="/login" className="bg-red-600 p-5">
                            Login
                        </Link>
                    </div>
                )
            }
        </div>
    )
}

export default UserProfile
