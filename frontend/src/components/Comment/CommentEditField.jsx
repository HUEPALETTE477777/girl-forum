import React, { useState, useRef } from 'react';
import { useComment } from '../../context/CommentContext';
import { useParams } from 'react-router-dom';

const CommentEditField = ({ initialComment, initialImage, commentId, hasClickedEditButton, onEditSubmitted }) => {
    const { editComment, fetchAllCommentsUnderPost } = useComment();
    const { id } = useParams();

    const [editedText, setEditedText] = useState(initialComment || null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(initialImage || null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef(null);

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
            setIsSubmitting(true);

            const payload = {
                comment: editedText,
                file: selectedFile,
                comment_id: commentId,
            };

            await editComment(payload, (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percent);
            });

            await fetchAllCommentsUnderPost(id);

            setSelectedFile(null);
            setUploadProgress(0);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            onEditSubmitted?.();

        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
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
                            <img src={initialImage} className="max-w-xs max-h-xs object-cover border border-gray-500" />
                            <p>COMMENT: {editedText}</p>
                        </>
                    )
                }
            </form>
    );
};

export default CommentEditField;
