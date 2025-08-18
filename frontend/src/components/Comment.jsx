import React, { useState, useRef } from 'react'

import CommentReplyField from './CommentReplyField'
import DateFormat from '../utils/FormatDate'

import { useComment } from '../context/CommentContext'
import { useAuth } from '../context/AuthContext'

import { useParams } from 'react-router-dom'


const Comment = ({ c }) => {
    const { editComment, fetchAllCommentsUnderPost } = useComment();
    const { user } = useAuth();
    const [hasClickedReplyButton, setHasClickedReplyButton] = useState(false);
    const [hasClickedEditButton, setHasClickedEditButton] = useState(false);

    const [editedText, setEditedText] = useState(c.comment);

    const fileInputRef = useRef(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { id } = useParams();

    const handleFileChange = (evt) => {
        const file = evt.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleEditButtonClick = () => {
        setHasClickedEditButton(prev => !prev);
        setEditedText(c.comment);
        setPreviewUrl(c?.image);
    }

    const handleReplyButtonClick = () => {
        setHasClickedReplyButton(prev => !prev);
    }

    const submitHandler = async (evt) => {
        evt.preventDefault();

        try {
            setIsSubmitting(true);

            const payload = {
                comment: editedText,
                file: selectedFile,
                comment_id: c.comment_id,
            }

            await editComment(payload, (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setUploadProgress(percent)
            });

            await fetchAllCommentsUnderPost(id);

            setSelectedFile(null);
            setUploadProgress(0);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div key={c._id} className="bg-gray-600 p-4 mb-4 border border-gray-500">
            <div className="flex items-center gap-4 mb-2">
                <img src={c.commenter?.avatar} className="w-16 h-16 object-cover border border-gray-500" />
                <div className="flex flex-col">
                    <h2 className="text-lg">USER: {c.commenter.username}</h2>
                    <p>USER ID: {c.commenter.user_id}</p>
                </div>

                {
                    (user.user_id == c.commenter.user_id) && (
                        <>
                            {
                                !hasClickedReplyButton && (
                                    <button
                                        className={`cursor-pointer ${hasClickedReplyButton ? 'bg-gray-800' : 'bg-blue-700'}`}
                                        onClick={handleEditButtonClick}
                                        disabled={hasClickedReplyButton}
                                    >
                                        {
                                            hasClickedEditButton ? "COLLAPSE" : "EDIT "
                                        }
                                    </button>
                                )
                            }

                        </>
                    )
                }
                {
                    !hasClickedEditButton && (
                        <button
                            className={`cursor-pointer ${hasClickedEditButton ? 'bg-gray-800' : 'bg-green-400'}`}
                            onClick={handleReplyButtonClick}
                            disabled={hasClickedEditButton}
                        >
                            {
                                hasClickedReplyButton ? "COLLAPSE" : "REPLY "
                            }
                        </button>
                    )
                }
            </div>

            <form onSubmit={submitHandler}>
                {
                    hasClickedEditButton ? (
                        <div className="flex flex-col bg-gray-400 p-4">
                            {
                                previewUrl && (
                                    <img src={previewUrl} className="max-w-xs max-h-xs object-cover border border-gray-500" />
                                )
                            }
                            <p>COMMENT: {editedText}</p>
                            <input
                                type="file"
                                accept="image/*"
                                className="mt-2 p-2 bg-gray-600 border border-gray-400 w-full cursor-pointer hover:bg-gray-900 transition-all"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            {
                                previewUrl && (
                                    <img
                                        src={previewUrl}
                                        className="max-h-64 mx-auto object-contain"
                                    />
                                )
                            }
                            {uploadProgress > 0 && (
                                <p className="text-2xl mt-1 text-green-700">{uploadProgress}% uploaded</p>
                            )}
                            <textarea
                                value={editedText}
                                onChange={(evt) => setEditedText(evt.target.value)}
                                className="w-full bg-gray-700 text-white border border-gray-400 p-2 mb-2 resize-none"
                            />
                            <button
                                className="bg-green-600 cursor-pointer"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                SAVE CHANGES!
                            </button>
                        </div>
                    ) : (
                        <>
                            <img src={c?.image} className="max-w-xs max-h-xs object-cover border border-gray-500" />
                            <p>COMMENT: {editedText}</p>
                        </>
                    )
                }
            </form>

            <CommentReplyField comment_id={c.comment_id} hasClickedReplyButton={hasClickedReplyButton} />

            <p className="text-sm">CREATED AT: {DateFormat(c.createdAt)}</p>
            <p className="text-sm mb-2">UPDATED AT: {DateFormat(c.updatedAt)}</p>

            {c.replies && c.replies.length > 0 && (
                <div className="ml-6 border-l border-gray-700 pl-4">
                    {c.replies.map(reply => (
                        <div key={reply._id} className="relative before:absolute before:top-1/2 before:-left-4 before:w-4 before:border-t before:border-gray-700">
                            <Comment c={reply} />
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}

export default Comment
