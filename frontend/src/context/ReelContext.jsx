import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const ReelContext = createContext();

export const ReelProvider = ({ children }) => {
    const [allReels, setAllReels] = useState([]);

    const fetchAllReels = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/reels/`, {
                withCredentials: true,
            })
            setAllReels(res.data.reels);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <ReelContext.Provider value={{
            allReels,
            fetchAllReels,
        }}>
            {children}
        </ReelContext.Provider>
    )
}

export const useReel = () => useContext(ReelContext);