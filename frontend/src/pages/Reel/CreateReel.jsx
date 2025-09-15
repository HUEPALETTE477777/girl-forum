import React, { useState, useRef } from 'react'
import { useReel } from '../../context/ReelContext'

const CreateReel = () => {
    const { createReel } = useReel();

    const [caption, setCaption] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
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
            const payload = {
                caption: caption,
                file: selectedFile,
            }

            await createReel(payload, (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percent);
            });

            clearPreview();

        } catch (err) {
            console.error(err);
        }
    }

    const clearPreview = () => {
        setPreviewUrl(null);
        setSelectedFile(null);
        setUploadProgress(0);
        setCaption("");

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }


    return (
        <form onSubmit={submitHandler} className="min-h-screen">
            <h1 className="text-center text-4xl py-4">I AM THE REELS PAGE</h1>
            {
                previewUrl && (
                    <div className="p-4 bg-gray-500">
                        <h1 className="text-white p-4 text-3xl">PREVIEW</h1>
                        <video
                            src={previewUrl}
                            controls
                            className="max-w-4xl object-cover"
                        />
                    </div>
                )
            }
            {uploadProgress > 0 && (
                <p className="text-2xl mt-1 text-green-700">{uploadProgress}% uploaded</p>
            )}
            <input
                type="file"
                className="mt-2 p-2 bg-gray-600 border border-gray-400 w-full cursor-pointer hover:bg-gray-900 transition-all"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <input
                type="text"
                className="bg-blue-200"
                value={caption}
                onChange={(evt) => setCaption(evt.target.value)}
            />
            <button onClick={clearPreview} className="bg-purple-600 cursor-pointer">
                clear preview
            </button>

            <button
                className="bg-green-600 cursor-pointer"
                type="submit"
            >
                SUBMIT
            </button>

        </form>
    )
}

export default CreateReel
