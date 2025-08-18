import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useComment } from '../context/CommentContext';
import { usePost } from '../context/PostContext';

import DateFormat from '../utils/FormatDate';
import CommentField from '../components/CommentField';
import Comment from '../components/Comment';

const PostDetail = () => {
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const { allCommentsUnderPost, fetchAllCommentsUnderPost } = useComment();
    const { post, fetchPost } = usePost();
    const { id } = useParams();

    const commentSectionRef = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchPost(id);
            await fetchAllCommentsUnderPost(id);
            setLoading(false);
        };
        loadData();
    }, [id]);

    const commentsPerPage = 10;
    const startIndex = (currentPage - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;

    const buildCommentTree = (comments) => {
        const map = {};
        const roots = [];

        comments.forEach(comment => {
            map[comment._id] = { ...comment, replies: [] };
        });

        comments.forEach(comment => {
            if (comment.parentComment === comment._id) {
                roots.push(map[comment._id]);
            } else {
                const parent = map[comment.parentComment];
                if (parent) {
                    parent.replies.push(map[comment._id]);
                } else {
                    roots.push(map[comment._id]);
                }
            }
        })

        return roots;
    }

    const commentTree = buildCommentTree(allCommentsUnderPost).slice(startIndex, endIndex);

    const totalPages = Math.ceil(commentTree.length / commentsPerPage);

    const handlePrev = () => {
        setCurrentPage(prev => (prev === 1 ? totalPages : prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => (prev === totalPages ? 1 : prev + 1));
    };

    const scrollToComments = () => {
        commentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    console.log(post);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <h1 className="text-2xl">LOADING POST!!!</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <div className="bg-gray-700 p-6 w-full max-w-4xl border border-gray-600">
                    <img src={post.image} className="w-full max-h-96 mb-4 border border-gray-600" />
                    <h1 className="text-xl font-bold mb-2">{post.title}</h1>
                    <h2 className="mb-2">POST ID: {post.post_id}</h2>

                    <div className="flex items-center gap-3 mb-4">
                        <img src={post.author.avatar} className="w-24 h-24 object-cover border border-gray-600" />
                        <h3 className="text-lg">By: {post.author.username}</h3>
                    </div>

                    <div className="tiptap mb-4" dangerouslySetInnerHTML={{ __html: post.content }} />
                    <p>CREATED AT: {DateFormat(post.createdAt)}</p>
                    <p>LAST UPDATED AT: {DateFormat(post.updatedAt)}</p>

                    <div className="mt-6">
                        <button
                            onClick={scrollToComments}
                            className="bg-gray-600 text-white px-4 py-2 border cursor-pointer"
                        >
                            GO TO COMMENTS
                        </button>
                    </div>
                </div>
            </div>

            {allCommentsUnderPost && allCommentsUnderPost.length > 0 ? (
                <div className="w-full max-w-4xl mx-auto px-4 mt-8">
                    <CommentField />
                    <h1 className="text-center text-2xl mb-4 mt-8" ref={commentSectionRef}>COMMENT SECTION</h1>

                    {commentTree.map(comment => (
                        <Comment key={comment._id} c={comment} />)
                    )}


                    <div className="flex justify-center items-center gap-4 border-t border-gray-500 pt-4 pb-12">
                        <button
                            onClick={handlePrev}
                            className="px-4 py-2 bg-white text-gray-800 border border-gray-600 cursor-pointer"
                        >
                            PREVIOUS
                        </button>
                        <span className="text-white">
                            PAGE {currentPage} OF {totalPages}
                        </span>
                        <button
                            onClick={handleNext}
                            className="px-4 py-2 bg-white text-gray-800 border border-gray-600 cursor-pointer"
                        >
                            NEXT
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-8 p-12">
                    <h1 className="text-lg mb-4">NO COMMENTS! BE THE FIRST ONE TO CREATE A COMMENT!</h1>
                    <CommentField />
                </div>
            )}
        </div>
    );
};

export default PostDetail;
