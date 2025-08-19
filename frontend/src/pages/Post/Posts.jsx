import React, { useState, useEffect } from 'react';
import { usePost } from '../../context/PostContext';
import DateFormat from '../../utils/FormatDate';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PostModal from '../../components/PostModal';

const Posts = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { posts, fetchPosts, deletePost } = usePost();
    const { user } = useAuth();

    useEffect(() => {
        fetchPosts();
    }, [])

    const postsPerPage = 2;
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

    const postsLength = posts.length || 0;
    const totalPages = Math.ceil(postsLength / postsPerPage);

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

    const [showModal, setShowModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    const handleDeleteClick = (postId) => {
        setPostToDelete(postId);
        setShowModal(true);
    };

    const confirmDelete = () => {
        if (postToDelete) {
            deletePost(postToDelete);
            setPostToDelete(null);
            setShowModal(false);
        }
    };

    const cancelDelete = () => {
        setPostToDelete(null);
        setShowModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-4xl text-center p-6">POSTS</h1>
            <div className="mx-auto flex gap-6 justify-center">
                {
                    currentPosts && currentPosts.length > 0 ? (
                        currentPosts.map(post => (
                            <div key={post._id} className="bg-gray-200 p-6 border">

                                <h2 className="text-2xl font-bold text-gray-800">{post.title}</h2>

                                <div
                                    className="tiptap"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />

                                {post.image ? (
                                    <img src={post.image} className="max-w-2xl max-h-2xl" />
                                ) : (
                                    <></>
                                )}

                                <div className=" text-gray-600 my-2 space-y-3">
                                    <div className="flex flex-row items-center gap-3">
                                        <img src={post.author?.avatar} className="w-16 h-16 aspect-square object-cover border-2" />
                                        <div className="flex flex-col">
                                            <span>Author: {post.author.username}</span>
                                            <span>Post ID: {post.post_id}</span>
                                        </div>
                                        {
                                            (user.user_id == post.author.user_id) && (
                                                <>
                                                    <Link to={{
                                                        pathname: `/posts/${post.post_id}/edit`,
                                                    }}
                                                        className="bg-gray-400 text-white border hover:border-gray-700 hover:text-gray-400 hover:bg-black "
                                                    >
                                                        EDIT OWN POST!
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(post.post_id)}
                                                        className="bg-red-600 text-white border hover:border-gray-700 hover:text-gray-400 hover:bg-black cursor-pointer"
                                                    >
                                                        DELETE OWN POST!
                                                    </button>
                                                    <PostModal
                                                        show={showModal}
                                                        close={cancelDelete}
                                                        confirm={confirmDelete}
                                                    />
                                                </>
                                            )
                                        }
                                    </div>
                                    <Link to={{
                                        pathname: `/posts/${post.post_id}`,
                                    }}
                                        className="hover:border-b"
                                    >
                                        VIEW POST!
                                    </Link>
                                </div>

                                <span className="text-sm text-gray-500">{DateFormat(post.createdAt)}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-600 text-lg mt-10">
                            NO POSTS!
                        </div>
                    )
                }
            </div>
            <div className="mx-auto max-w-2xl">
                {
                    posts && posts.length > postsPerPage && (
                        <div className="flex justify-center gap-4 mt-8">
                            <button
                                onClick={handlePrev}
                                className="px-4 py-2 bg-white text-gray-700 border cursor-pointer"
                            >
                                PREVIOUS
                            </button>
                            <span className="self-center text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={handleNext}
                                className="px-4 py-2 bg-white text-gray-700 border cursor-pointer"
                            >
                                NEXT
                            </button>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Posts;
