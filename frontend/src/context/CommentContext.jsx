import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const CommentContext = createContext();

export const CommentProvider = ({ children }) => {
    const [allCommentsUnderPost, setAllCommentsUnderPost] = useState([]);
    const [commentUnderPost, setCommentUnderPost] = useState(null);
    const [replyUnderComment, setReplyUnderComment] = useState(null);
    const [allRepliesUnderComment, setAllRepliesUnderComment] = useState({});
    const [editedComment, setEditedComment] = useState(null);

    const fetchAllCommentsUnderPost = async (post_id) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/comment/post/${post_id}`, {
                withCredentials: true,
            })
            setAllCommentsUnderPost(res.data.comments);
        } catch (err) {
            console.error(err);
        }
    }

    /* 
        jade-ling jinsu barreto babies me through this func here
    */

    const createACommentUnderPost = async (payload, onUploadProgress = null) => {
        try {
            const formData = new FormData();
            formData.append('comment', payload.comment);
            if (payload.file) {
                formData.append('image', payload.file);
            }
            const res = await axios.post(`${import.meta.env.vite_backend_endpoint}/api/comment/post/${payload.post_id}`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress,
            })
            setCommentUnderPost(res.data.comment);
        } catch (err) {
            console.error(err);
        }
    }

    const createAReplyUnderComment = async (payload, onUploadProgress = null) => {
        try {
            const formData = new FormData();
            formData.append('comment', payload.comment);
            if (payload.file) {
                formData.append('image', payload.file);
            }
            const res = await axios.post(`${import.meta.env.vite_backend_endpoint}/api/comment/${payload.comment_id}/reply`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress,
            });
            setReplyUnderComment(res.data.comment);
        } catch (err) {
            console.error(err);
        }
    }

    const getAllRepliesUnderComment = async (comment_id) => {
        try {
            const res = await axios.get(`${import.meta.env.vite_backend_endpoint}/api/comment/${comment_id}/reply`, {
                withCredentials: true,
            });
            setAllRepliesUnderComment(prev => ({
                ...prev,
                [comment_id]: res.data.replies,
            }));
        } catch (err) {
            console.error(err);
        }
    }

    const editComment = async (payload, onUploadProgress = null) => {
        try {
            const formData = new FormData();
            formData.append('comment', payload.comment);

            if (payload.file) {
                formData.append('image', payload.file);
            }

            const res = await axios.patch(`${import.meta.env.vite_backend_endpoint}/api/comment/${payload.comment_id}/edit`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress,
            })
            setEditedComment(res.data.updatedComment);
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <CommentContext.Provider value={{
            allCommentsUnderPost,
            commentUnderPost,
            replyUnderComment,
            fetchAllCommentsUnderPost,
            createACommentUnderPost,
            createAReplyUnderComment,
            allRepliesUnderComment,
            getAllRepliesUnderComment,
            editComment,
            editedComment,
        }}>
            {children}
        </CommentContext.Provider>
    );
}

export const useComment = () => useContext(CommentContext);