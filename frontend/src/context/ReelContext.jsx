import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const ReelContext = createContext();

export const ReelProvider = ({ children }) => {
    const [allReels, setAllReels] = useState([]);

    const fetchAllReels = async (page = 1, limit = 2) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/reels?page=${page}&limit=${limit}`, {
                withCredentials: true,
            })
            const newReels = res.data.reels;

            setAllReels(prev => [...prev, ...newReels]);
            return res.data;
        } catch (err) {
            console.error(err);
            return { reels: [] };
        }
    }

    const clearReels = () => {
        setAllReels([]);
    };

    const createReel = async (payload, onUploadProgress = null) => {
        try {
            const formData = new FormData();
            formData.append('caption', payload.caption);
            if (payload.file) {
                formData.append('video', payload.file);
            }
            if (payload.hashtags) {
                formData.append('hashtags', payload.hashtags);
            }

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/reels/create`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress,
            })

            console.log(res);

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <ReelContext.Provider value={{
            allReels,
            fetchAllReels,
            createReel,
            clearReels,
        }}>
            {children}
        </ReelContext.Provider>
    )
}

export const useReel = () => useContext(ReelContext);