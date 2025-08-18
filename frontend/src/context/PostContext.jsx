import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState({});

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/posts/`, {
                withCredentials: true,
            });
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    const fetchPost = async (post_id) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/posts/${post_id}`, {
                withCredentials: true,
            })
            setPost(res.data.post[0]);
        } catch (err) {
            console.error(err);
        }
    }

    const createPost = async (payload, onUploadProgress = null) => {
        try {
            const formData = new FormData();
            formData.append('title', payload.title);
            formData.append('content', payload.content);
            if (payload.file) {
                formData.append('image', payload.file);
            }

            await axios.post(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/posts`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress,
            });

            await fetchPosts();
        } catch (err) {
            console.error(err);
        }
    };

    const updatePost = async (payload, onUploadProgress = null) => {
        try {
            const formData = new FormData();
            formData.append('title', payload.title);
            formData.append('content', payload.content);
            if (payload.file) {
                formData.append('image', payload.file);
            }

            await axios.patch(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/posts/${payload.post_id}`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress,
            });

            await fetchPosts();
        } catch (err) {
            console.error(err);
        }
    }

    const deletePost = async (post_id) => {
        try {
            const postId = parseInt(post_id)
            await axios.delete(`${import.meta.env.VITE_BACKEND_ENDPOINT}/api/posts/${postId}`, {
                withCredentials: true,
            })
            
            await fetchPosts();
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <PostContext.Provider value={{
            posts,
            fetchPosts,
            createPost,
            fetchPost,
            post,
            updatePost,
            deletePost,
        }}>
            {children}
        </PostContext.Provider>
    )
}


export const usePost = () => useContext(PostContext);