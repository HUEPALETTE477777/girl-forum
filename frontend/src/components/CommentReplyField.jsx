import React, { useState, useEffect, useRef } from 'react'

import { useComment } from '../context/CommentContext';
import { useParams } from 'react-router-dom';

/* 

    PROP DRILL 1 LEVEL!
    8/3/2025
    GIRLFRIEND REMAINS SICK FOR THE PAST 2 DAYS

*/

const CommentReplyField = ({ comment_id, hasClickedReplyButton, hasClickedEditButton, onReplySubmitted }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0)

    const fileInputRef = useRef(null);
    const { id } = useParams();

    const {
        createAReplyUnderComment,
        fetchAllCommentsUnderPost,
    } = useComment();

    const handleFileChange = (evt) => {
        const file = evt.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const submitHandler = async (evt) => {
        evt.preventDefault();

        try {
            const payload = {
                comment_id: comment_id,
                comment: replyText,
                file: selectedFile,
            };

            await createAReplyUnderComment(payload, (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setUploadProgress(percent)
            });
            await fetchAllCommentsUnderPost(id); // COMPLETELY GAVE UP ON OPTIMIZATION

            setReplyText('');
            setUploadProgress(0);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            onReplySubmitted?.();

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            {hasClickedReplyButton && !hasClickedEditButton && (
                <form onSubmit={submitHandler} className="flex flex-col space-y-3 mt-4 p-4 bg-gray-900">
                    <textarea
                        className="bg-gray-500 border border-white focus:outline-none"
                        placeholder="BEGIN REPLYING HERE!"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        required
                    />

                    <input
                        type="file"
                        accept="image/*"
                        className="mt-2 p-2 max-w-2xl bg-gray-600 border border-gray-400 w-full cursor-pointer hover:bg-gray-900 transition-all"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    {uploadProgress > 0 && (
                        <p className="text-2xl mt-1 text-green-700">{uploadProgress}% uploaded</p>
                    )}

                    {previewUrl && (
                        <div className="border border-gray-400 bg-gray-800 p-2">
                            <img
                                src={previewUrl}
                                className="max-h-64 mx-auto object-contain"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="bg-purple-800 p-4 cursor-pointer"
                    >
                        REPLY!
                    </button>
                </form>
            )}
        </>
    )
}


export default CommentReplyField
