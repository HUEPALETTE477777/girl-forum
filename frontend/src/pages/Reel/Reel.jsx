import React, { useEffect, useState } from 'react'

import { useReel } from '../../context/ReelContext'

const Reel = () => {
    const {
        allReels,
        fetchAllReels,
    } = useReel();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchAllReels();
            setLoading(false);
        }
        loadData();
    }, [])

    if (loading) {
        return <div className="min-h-screen">LOADING!</div>
    }

    return (
        <div className="min-h-screen">
            {allReels?.map((reel) => (
                <div
                    key={reel._id}
                    className="flex flex-col items-center justify-center px-4"
                >
                    <div className="max-w-4xl shadow-lg">
                        <video
                            src={reel.videoUrl}
                            controls
                            className="w-full object-cover"
                        />

                        <div className="p-4 flex flex-col justify-center">
                            <h1 className="text-xl font-semibold">{reel.caption}</h1>

                            <div className="flex items-center gap-3">
                                <img
                                    src={reel.author.avatar}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-black"
                                />
                                <h2 className="text-2xl ">{reel.author.username}</h2>
                            </div>
                            <p className="text-xl">REEL ID: {reel.reel_id}</p>

                            {
                                reel.hashtags?.map((hashtag) => (
                                    <p>#{hashtag}</p>
                                ))
                            }
                        </div>

                    </div>
                </div>
            ))}
        </div>
    )
}

export default Reel
