import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

import { Link } from 'react-router-dom';


import errorHandler from '../utils/ErrorHandler';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login, user } = useAuth();

    const submitHandler = async (evt) => {
        evt.preventDefault();

        try {
            const payload = { username, password };
            await login(payload);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user]); // USER NEEDED FOR REACT TO RERUN THE EFFECT AFTER CHANGE

    return (
        <div className="flex items-center justify-center bg-red-200 py-12">
            <div className="bg-white px-10 py-12 w-full max-w-md">
                <h2 className="text-2xl text-center">Login</h2>
                {
                    errorHandler()
                }
                <form className="space-y-6" onSubmit={submitHandler}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 focus:outline-none"
                            placeholder="SUPER PLACEHOLDER USERNAME"
                            value={username}
                            onChange={(evt) => setUsername(evt.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 focus:outline-none"
                            placeholder="SUPER PLACEHOLDER PASSWORD"
                            value={password}
                            onChange={(evt) => setPassword(evt.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white font-semibold py-2 px-4 cursor-pointer"
                    >
                        Log In
                    </button>
                    <div>
                        <Link to="/signup">click here to signup</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
