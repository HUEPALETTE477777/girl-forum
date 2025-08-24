import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { useFriend } from '../../context/FriendContext';
import { useComment } from '../../context/CommentContext';

import DateFormat from '../../utils/FormatDate';

const UserTargetProfile = () => {
    const { id } = useParams();
    const { viewedUserProfile, getViewingUserProfile } = useAuth();
    const { targetUserFriends, fetchTargetUserFriends } = useFriend();
    const { allTargetUserComments, fetchAllTargetUserComments } = useComment();

    const [searchAuthor, setSearchAuthor] = useState('');

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('friends');
    const [currentPage, setCurrentPage] = useState(1);

    const COMMENTS_PER_PAGE = 2;

    const filteredComments = allTargetUserComments.filter((comment) =>
        comment.post.author.username.toLowerCase().includes(searchAuthor.toLowerCase())
    );

    const totalPages = Math.ceil(filteredComments.length / COMMENTS_PER_PAGE);
    const lastCommentIndex = currentPage * COMMENTS_PER_PAGE;
    const firstCommentIndex = lastCommentIndex - COMMENTS_PER_PAGE;
    const currentComments = filteredComments.slice(firstCommentIndex, lastCommentIndex);

    const handlePrev = () => {
        setCurrentPage(Math.max(currentPage - 1, 1));
        if (currentPage === 1) {
            setCurrentPage(totalPages);
        }
    };

    const handleNext = () => {
        setCurrentPage(Math.min(currentPage + 1, totalPages));
        if (currentPage === totalPages) {
            setCurrentPage(1);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await getViewingUserProfile(id);
            await fetchTargetUserFriends(id);
            await fetchAllTargetUserComments(id);
            setLoading(false);
        };

        loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
                LOADING PROFILE!
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
                                    alt="User Avatar"
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
                <button
                    className={`px-4 py-2 font-semibold cursor-pointer ${activeTab === 'friends' ? 'border-b-4 border-grey-500 text-grey-600' : 'text-gray-600 hover:text-grey-500'
                        }`}
                    onClick={() => setActiveTab('friends')}
                >
                    FRIENDS ({targetUserFriends.length})
                </button>
                <button
                    className={`px-4 py-2 font-semibold cursor-pointer ${activeTab === 'comments' ? 'border-b-4 border-grey-500 text-grey-600' : 'text-gray-600 hover:text-grey-500'
                        }`}
                    onClick={() => setActiveTab('comments')}
                >
                    COMMENTS ({allTargetUserComments.length})
                </button>
            </div>

            <div className="mt-5 ">
                {activeTab === 'friends' && (
                    <>
                        {targetUserFriends && targetUserFriends.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 cursor-pointer">
                                {targetUserFriends.map((friend) => (
                                    <Link
                                        key={friend._id}
                                        to={`/profile/${friend.user_id}`}
                                        className="bg-blue-100 hover:bg-blue-200 p-4 border-2 cursor-pointer rounded"
                                    >
                                        {
                                            friend.avatar && (
                                                <img
                                                    src={friend.avatar}
                                                    className="w-28 h-28 border-2 border-gray-300 object-cover mx-auto mb-2"
                                                />
                                            )
                                        }
                                        <h1 className="text-lg font-medium text-center text-blue-900">
                                            {friend.username}
                                        </h1>
                                        <p className="text-center text-sm text-blue-800">USER ID: {friend.user_id}</p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">THIS USER HAS NO FRIENDS!</p>
                        )}
                    </>
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
                        {allTargetUserComments && allTargetUserComments.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 gap-4 cursor-pointer">
                                    {currentComments.map((c) => (
                                        console.log(c.post),
                                        <Link
                                            to={{
                                                pathname: `/posts/${c.post.post_id}`,
                                            }}
                                            key={c._id}
                                            className="p-4 border bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <div className="p-4 bg-gray-400 flex flex-col justify-center">
                                                <img src={c.post.image} />
                                                <h1 dangerouslySetInnerHTML={{ __html: c.post.title }}></h1>
                                                <h2>AUTHOR: {c.post.author.username}</h2>
                                                <p>POST ID: {c.post.post_id}</p>
                                            </div>
                                            <div className="p-4 bg-green-500">
                                                {
                                                    c.image && (
                                                        <img src={c.image} />
                                                    )
                                                }
                                                <h1 className="text-gray-800">{c.username}: {c.comment}</h1>
                                                <p>COMMENT ID: {c.comment_id}</p>
                                                <p>Created: {DateFormat(c.createdAt)}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <div className="bg-green-700 flex justify-center p-4 items-center space-x-4">
                                    <button onClick={handlePrev} className="bg-gray-400 cursor-pointer">prev</button>
                                    <p>PAGE: {currentPage} OUT OF {totalPages}</p>
                                    <button onClick={handleNext} className="bg-gray-400 cursor-pointer">next</button>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-600">THIS GURT BOY HAS NEVER MADE A COMMENT BEFORE!</p>
                        )}
                    </>
                )}

            </div>
        </div>
    );
};

export default UserTargetProfile;
