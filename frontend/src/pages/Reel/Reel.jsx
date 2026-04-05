import React, { useRef, useCallback, useEffect, useState } from 'react'

import { useReel } from '../../context/ReelContext'

const Reel = () => {
    const { allReels, fetchAllReels, clearReels } = useReel();
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef(); // REF INSTEAD OF STATE FOR NO RE-RENDERS AND A MUTABLE
    const pageRef = useRef(1);
    const isFetchingRef = useRef(false); // SERVES AS A LOCK BEFORE A FETCH REQ COMES THRU


    const lastReelRef = useCallback(node => {
        if (loading || !hasMore) {
            return;
        }
        if (observer.current) {
            observer.current.disconnect();
        }

        observer.current = new IntersectionObserver(entries => {
            console.log(entries);
            if (entries[0].isIntersecting && hasMore && !loading) {
                fetchMoreReels();
            }
        })

        if (node) {
            observer.current.observe(node);
        }
    }, [loading, hasMore])

    const fetchMoreReels = async () => {
        // INCOMING FETCH REQ, DENIED
        if (isFetchingRef.current) {
            return;
        }

        isFetchingRef.current = true;
        setLoading(true);

        // NASA SPACE CRITICALITY FOR SYNCED FETCHING HERE
        const nextPage = pageRef.current;
        const res = await fetchAllReels(nextPage);
        if (res?.reels?.length === 0) {
            setHasMore(false);
        } else {
            pageRef.current += 1;
        }

        setLoading(false);
        isFetchingRef.current = false;
    };

    useEffect(() => {
        // CLEAR PRE-EXISTING APPENDED REEL DATA
        clearReels();
        const init = async () => {
            await fetchMoreReels(1);
        };
        init();
    }, []);

    if (loading && allReels.length === 0) {
        return <div className="min-h-screen">LOADING!</div>;
    }

    return (
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
            {allReels?.map((reel, index) => {
                const isLast = allReels.length === index + 1;
                return <div
                    key={reel._id}
                    ref={isLast ? lastReelRef : null}
                    className="h-screen snap-start flex flex-col items-center justify-center"
                >
                    <div className="max-w-4xl shadow-lg">
                        <video
                            src={reel.videoUrl}
                            controls
                            muted
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
                                reel.hashtags?.map((hashtag, idx) => (
                                    <p key={`${hashtag}-${idx}`}>#{hashtag}</p>
                                ))
                            }
                        </div>

                    </div>
                </div>
            })}
            {loading && <div>Loading more items...</div>}
            {!hasMore && <div>No more items to load.</div>}
        </div>
    )
}

export default Reel
