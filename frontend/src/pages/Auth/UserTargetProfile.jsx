import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { useFriend } from '../../context/FriendContext';
import { useComment } from '../../context/CommentContext';
import { usePost } from '../../context/PostContext';

import DateFormat from '../../utils/FormatDate';

const UserTargetProfile = () => {
    const { id } = useParams();
    const { viewedUserProfile, getViewingUserProfile } = useAuth();
    const { targetUserFriends, fetchTargetUserFriends } = useFriend();
    const { allTargetUserComments, fetchAllTargetUserComments } = useComment();
    const { fetchUserPosts, userPosts } = usePost();

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('friends');

    const [searchAuthor, setSearchAuthor] = useState('');
    const [commentPage, setCommentPage] = useState(1);

    const [postPage, setPostPage] = useState(1);

    const filteredComments = allTargetUserComments.filter((comment) =>
        comment.post.author.username.toLowerCase().includes(searchAuthor.toLowerCase())
    );

    const ITEMS_PER_PAGE = 2;
    const paginate = (items, page, itemsPerPage) => {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return items.slice(start, end);
    };


    const totalCommentPages = Math.ceil(filteredComments.length / ITEMS_PER_PAGE);
    const currentComments = paginate(filteredComments, commentPage, ITEMS_PER_PAGE);

    const totalPostPages = Math.ceil(userPosts.length / ITEMS_PER_PAGE);
    const currentPosts = paginate(userPosts, postPage, ITEMS_PER_PAGE);

    const handleCommentPrev = () => {
        setCommentPage((prev) => (prev === 1 ? totalCommentPages : prev - 1));
    };

    const handleCommentNext = () => {
        setCommentPage((prev) => (prev === totalCommentPages ? 1 : prev + 1));
    };

    const handlePostPrev = () => {
        setPostPage((prev) => (prev === 1 ? totalPostPages : prev - 1));
    };

    const handlePostNext = () => {
        setPostPage((prev) => (prev === totalPostPages ? 1 : prev + 1));
    };


    useEffect(() => {
        const loadBaseData = async () => {
            setLoading(true);
            await getViewingUserProfile(id);
            setLoading(false);
        };

        loadBaseData();
    }, [id]);

    useEffect(() => {
        const fetchTabData = async () => {
            if (activeTab === 'friends') {
                setLoading(true);
                await fetchTargetUserFriends(id);
                setLoading(false);
            } else if (activeTab === 'comments') {
                setLoading(true);
                await fetchAllTargetUserComments(id);
                setLoading(false);
            } else if (activeTab === 'posts') {
                setLoading(true);
                await fetchUserPosts(id);
                setLoading(false);
            }
        };

        fetchTabData();
    }, [activeTab, id]);

    if (!viewedUserProfile || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
                LOADING!
            </div>
        );
    }


    return (
        <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
            {viewedUserProfile && (
                <div className="bg-white border-2 border-gray-300 p-6">
                    <div className="flex items-center gap-3">
                        {viewedUserProfile.avatar && (
                            <a href={viewedUserProfile.avatar} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={viewedUserProfile.avatar}
                                    className="w-28 h-28 border-2 border-gray-300 object-cover"
                                />
                            </a>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Username: {viewedUserProfile.username}</h1>
                            <p className="text-gray-600">User ID: {viewedUserProfile.user_id}</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Account Created: {DateFormat(viewedUserProfile.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <div className="mt-6 border-b border-gray-300 flex gap-4">
                {['friends', 'comments', 'posts'].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 font-semibold cursor-pointer ${activeTab === tab ? 'border-b-4 border-grey-500 text-grey-600' : 'text-gray-600 hover:text-grey-500'}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="mt-5">

                {activeTab === 'friends' && (
                    targetUserFriends.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-4">
                            {targetUserFriends.map((friend) => (
                                <Link
                                    key={friend._id}
                                    to={`/profile/${friend.user_id}`}
                                    className="bg-blue-100 hover:bg-blue-200 p-4 border-2"
                                >
                                    {friend.avatar && (
                                        <img
                                            src={friend.avatar}
                                            className="w-28 h-28 border-2 border-gray-300 object-cover mx-auto mb-2"
                                        />
                                    )}
                                    <h1 className="text-lg font-medium text-center text-blue-900">
                                        {friend.username}
                                    </h1>
                                    <p className="text-center text-sm text-blue-800">USER ID: {friend.user_id}</p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">THIS USER HAS NO FRIENDS!</p>
                    )
                )}

                {activeTab === 'comments' && (
                    <>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="SEARCH BY AUTHOR USERNAME"
                                value={searchAuthor}
                                onChange={(evt) => setSearchAuthor(evt.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 focus:outline-none"
                            />
                        </div>
                        {filteredComments.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2">
                                    {currentComments.map((c) => (
                                        <Link
                                            key={c.post._id}
                                            to={`/posts/${c.post.post_id}`}
                                            className="p-4 border bg-black hover:bg-gray-100"
                                        >
                                            <div className="p-4 bg-gray-400">
                                                <img src={c.post.image} />
                                                <h1 dangerouslySetInnerHTML={{ __html: c.post.title }}></h1>
                                                <h2>AUTHOR: {c.post.author.username}</h2>
                                                <p>POST ID: {c.post.post_id}</p>
                                            </div>

                                            {
                                                c.comments.map((c_comments) => (
                                                    <div
                                                        key={c_comments._id}
                                                        className="p-4 bg-purple-600"
                                                    >
                                                        {
                                                            c_comments.image && <img src={c_comments.image} />
                                                        }
                                                        <div className="bg-black text-white p-2">
                                                            <h1>{c_comments.username}: {c_comments.comment}</h1>
                                                            <p>COMMENT ID: {c_comments.comment_id}</p>
                                                            <p>CREATED ON: {DateFormat(c_comments.createdAt)}</p>
                                                            <p>UPDATED ON: {DateFormat(c_comments.updatedAt)}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            }

                                        </Link>
                                    ))}
                                </div>
                                <div className="bg-green-700 flex justify-center p-4 space-x-4">
                                    <button onClick={handleCommentPrev} className="bg-gray-400 px-3 py-1 cursor-pointer">PREV</button>
                                    <p>PAGE: {commentPage} OUT OF {totalCommentPages}</p>
                                    <button onClick={handleCommentNext} className="bg-gray-400 px-3 py-1 cursor-pointer">NEXT</button>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-600">THIS GURT BOY HAS NEVER MADE A COMMENT BEFORE!</p>
                        )}
                    </>
                )}

                {activeTab === 'posts' && (
                    userPosts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2">
                                {currentPosts.map((c) => (
                                    <Link
                                        key={c._id}
                                        to={`/posts/${c.post_id}`}
                                        className="bg-black p-4 text-white hover:bg-white hover:text-black"
                                    >
                                        {c.image && <img src={c.image} />}
                                        <h1>TITLE: {c.title}</h1>
                                        <h2>POST ID: {c.post_id}</h2>
                                        <p>CREATED ON {DateFormat(c.createdAt)}</p>
                                        <p>UPDATED ON: {DateFormat(c.updatedAt)}</p>
                                    </Link>
                                ))}
                            </div>
                            <div className="bg-black text-white flex justify-center p-4 space-x-4">
                                <button onClick={handlePostPrev} className="bg-gray-600 px-3 py-1 cursor-pointer">PREV</button>
                                <p>PAGE: {postPage} OUT OF {totalPostPages}</p>
                                <button onClick={handlePostNext} className="bg-gray-600 px-3 py-1 cursor-pointer">NEXT</button>
                            </div>
                        </>
                    ) : (
                        <p>NO USER POSTS</p>
                    )
                )}
            </div>
        </div>
    );
};

export default UserTargetProfile;
