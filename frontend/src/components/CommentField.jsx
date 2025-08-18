import React, { useState, useRef } from 'react';
import { useComment } from '../context/CommentContext';
import { useParams } from 'react-router-dom';

const CommentField = () => {
    const [comment, setComment] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef(null);
    const { createACommentUnderPost, fetchAllCommentsUnderPost } = useComment();
    const { id } = useParams();
    const [uploadProgress, setUploadProgress] = useState(0)

    const handleFileChange = (evt) => {
        const file = evt.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const submitHandler = async (evt) => {
        evt.preventDefault();
        setIsSubmitting(true);

        const payload = { post_id: id, comment, file: selectedFile };

        try {
            await createACommentUnderPost(payload, (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percent);
            });
            await fetchAllCommentsUnderPost(id); // COMPLETELY GAVE UP ON OPTIMIZATION

            setComment('');
            setSelectedFile(null);
            setUploadProgress(0);
            setPreviewUrl(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-700 w-full p-8 border-t border-gray-600">
            <h2 className="text-white text-xl font-semibold mb-4">LEAVE A COMMENT</h2>
            <form onSubmit={submitHandler} className="flex flex-col gap-4">
                <textarea
                    className="bg-white text-gray-800 p-4 h-32 border border-gray-400 focus:outline-none"
                    placeholder="WRITE YOUR COMMENT HERE!"
                    value={comment}
                    onChange={(evt) => setComment(evt.target.value)}
                    required
                />

                <label className="text-white font-medium flex flex-col">
                    OPTIONALLY UPLOAD AN IMAGE!
                    <input
                        type="file"
                        accept="image/*"
                        className="mt-2 p-2 max-w-2xl bg-gray-600 border border-gray-400 w-full cursor-pointer hover:bg-gray-900 transition-all"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                </label>

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
                    disabled={isSubmitting}
                    className={`py-3 px-6 border text-white 
                        ${isSubmitting ?
                            'bg-green-400 border-green-600 cursor-not-allowed'
                            :
                            'bg-green-600 border-green-800 hover:bg-green-700 cursor-pointer'
                        }`
                    }
                >
                    COMMENT DOWN NOW!
                </button>
            </form>
        </div>
    );
};

export default CommentField;
