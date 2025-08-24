// REACT REDUX IS A PIECE OF GARBAGE
// ONLY TO APPEASE R*TARDED RECRUITERS FOR A LIST OF T*CHNOLOGIES
// USE THE BUILT IN CONTEXT

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [searchedUser, setSearchedUser] = useState(null);

    const [viewedUserProfile, setViewedUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentAuthError, setCurrentAuthError] = useState(null);

    useEffect(() => {
        fetchUser()
    }, []);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/users/user`, {
                withCredentials: true,
            });
            setUser(res.data.user);
            setCurrentAuthError(null);
        } catch (err) {
            setUser(null);
            // if (err.response?.status === 401) {
            //     window.location.href = `/unauthorized`;
            // }
            setCurrentAuthError(err.response.status);
        } finally {
            setLoading(false);
        }
    };

    const login = async (payload) => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/users/login`, payload, {
                withCredentials: true,
            });
            await fetchUser();
            setCurrentAuthError(null);
        } catch (err) {
            setCurrentAuthError(err.response.data.message);
        }
    };

    const signup = async (payload) => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/users/signup`, payload, {
                withCredentials: true,
            });
            await fetchUser();
            setCurrentAuthError(null);
        } catch (err) {
            setCurrentAuthError(err.response.status);
            console.error(err);
        }
    }

    const logout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/users/logout`, {}, {
                withCredentials: true,
            });
            setUser(null);
            setCurrentAuthError(null);
        } catch (err) {
            console.error(err);
            setCurrentAuthError(err.response.status);
        }
    };

    const searchUser = async (payload) => {
        try {
            if (user) {
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/users/user/search`, { username: payload }, {
                    withCredentials: true,
                });
                setSearchedUser(res.data.users);
            }
        } catch (err) {
            setSearchedUser([]);
            console.error(err);
            setCurrentAuthError(err.response.status);
        }
    }

    const updateUser = async (payload, onUploadProgress = null) => {
        try {
            const formData = new FormData();
            formData.append('username', payload.username);
            if (payload.file) {
                formData.append('avatar', payload.file);
            }

            await axios.patch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/users/user/`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress,
            });
            await fetchUser();
            setCurrentAuthError(null);
        } catch (err) {
            console.error(err);
            setCurrentAuthError(err.response.status);
        }
    }

    const getViewingUserProfile = async (user_id) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/users/user/${user_id}`, {}, {
                withCredentials: true,
            })
            setViewedUserProfile(res.data.user);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            fetchUser,
            login,
            logout,
            signup,
            searchUser,
            searchedUser,
            updateUser,
            currentAuthError,
            viewedUserProfile,
            getViewingUserProfile,
            loading,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
