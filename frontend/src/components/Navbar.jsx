import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [search, setSearch] = useState('');
    const { user, logout, searchUser } = useAuth();

    const navigate = useNavigate();

    const submitHandler = async (evt) => {
        evt.preventDefault();

        try {
            await searchUser(search);
            navigate("/search");
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <nav className="bg-gray-800 top-0 sticky z-50">
            <div className="max-w-7xl mx-auto px-4 py-5">
                <div className="flex items-center justify-between h-16">
                    <h1 className="text-xl text-white">
                        <Link to="/">superman title</Link>
                    </h1>

                    <form onSubmit={submitHandler}>
                        <label className="focus-within:text-gray-600">
                            <input type="search"
                                placeholder="SEARCH USERS HERE"
                                className="w-full px-4 py-3 bg-white focus:outline-none border border-gray-500 focus:border-gray-800"
                                value={search}
                                onChange={(evt) => setSearch(evt.target.value)}
                            />
                        </label>
                    </form>

                    <ul className="flex space-x-12 items-center text-white">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/posts">Posts</Link></li>
                        <li><Link to="/reels">Reels</Link></li>
                        <li>
                            {
                                user ? (
                                    <Link to="/profile" className="flex items-center justify-center gap-3">
                                        {
                                            user.avatar ? <img src={user?.avatar} className="w-16 h-16 aspect-square object-cover border-2" /> : (<></>)
                                        }
                                        <h1 className="font-semibold">{user.username}</h1>
                                    </Link>
                                ) : (
                                    <Link to="/login" className="text-white transition">
                                        Not Logged In
                                    </Link>
                                )
                            }
                        </li>
                        <li>
                            {
                                user ? (
                                    <button className="cursor-pointer" onClick={logout}>LOGOUT</button>
                                ) : (
                                    <></>
                                )
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
