import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import errorHandler from '../utils/ErrorHandler';

const UpdateUser = () => {
    const { user, updateUser } = useAuth();
    const [username, setUsername] = useState(user?.username || '');

    const [selectedFile, setSelectedFile] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [previewUrl, setPreviewUrl] = useState(null)

    const fileInputRef = useRef(null)

    const handleFileChange = (evt) => {
        const file = evt.target.files[0]
        if (file) {
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const submitHandler = async (evt) => {
        evt.preventDefault()

        const payload = { username, file: selectedFile }

        try {
            await updateUser(payload, (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setUploadProgress(percent)
            })

            setUsername('');
            setSelectedFile(null)
            setUploadProgress(0)
            setPreviewUrl(null)

            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="bg-gray-500 flex items-center justify-center min-h-screen">
            <form onSubmit={submitHandler} className="flex flex-col gap-1 p-12 border bg-green-200 w-3/4">
                <h1 className="text-4xl">UPDATE USER</h1>
                <label>NEW USERNAME</label>
                {
                    errorHandler()
                }
                <input
                    type="text"
                    value={username}
                    onChange={(evt) => setUsername(evt.target.value)}
                    placeholder="ENTER USERNAME HERE"
                    className="border bg-white focus:outline-none"
                    required
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="p-7 bg-gray-100 border cursor-pointer"
                />

                {uploadProgress > 0 && (
                    <p className="text-2xl mt-1 text-green-700">{uploadProgress}% uploaded</p>
                )}

                {previewUrl && (
                    <div className="w-full">
                        <img
                            src={previewUrl}
                            className="max-h-64 object-contain border-gray-300 p-2"
                        />
                    </div>
                )}

                <button type="submit" className="bg-red-300 border cursor-pointer">
                    UPDATE
                </button>

            </form>
        </div>
    )
}

export default UpdateUser
