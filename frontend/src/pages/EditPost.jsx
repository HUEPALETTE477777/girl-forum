import React, { useEffect, useState, useRef } from 'react'
import { usePost } from '../context/PostContext'
import { useParams } from 'react-router-dom';
import PostTextEditor from '../utils/PostTextEditor';
import "../utils/TipTapStyles.css"

const EditPost = () => {
    const { post, fetchPost, updatePost } = usePost();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)

    const fileInputRef = useRef(null);
    const editorRef = useRef(null);

    const { id } = useParams();

    useEffect(() => {
        const loadData = async () => {
            await fetchPost(id);
        }
        loadData();
    }, [id]);

    useEffect(() => {
        if (post) {
            /* 
                COMPONENT CHANGING FROM CONTROLLED INPUT TO UNCONTROLLED!
                NEED OR STATEMENT TO FALLBACK ON INITIAL STATE
            */
            setTitle(post.title || '');
            setContent(post.content || '');
            setPreviewUrl(post.image || null);
            if (editorRef.current) {
                editorRef.current.setContent(post.content || '');
            }
        }
    }, [post])


    const handleFileChange = (evt) => {
        const file = evt.target.files[0]
        if (file) {
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const submitHandler = async (evt) => {
        evt.preventDefault();

        try {
            const payload = {
                title: title,
                content: content,
                file: selectedFile,
                post_id: id,
            }

            console.log(payload);

            await updatePost(payload, (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setUploadProgress(percent)
            })

            setTitle('')
            setContent('')
            setSelectedFile(null)
            setUploadProgress(0)
            setPreviewUrl(null)

            if (editorRef.current) {
                editorRef.current.clear();
            }

            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <form onSubmit={submitHandler} className="min-h-screen flex items-center justify-center bg-gray-200">
            {
                post && (<div className="bg-white border p-8 w-full max-w-4xl space-y-6">
                    <h2 className="text-3xl font-bold text-gray-800 text-center">EDIT YOUR POST</h2>

                    <input
                        type="text"
                        placeholder="Enter post title..."
                        className="w-full p-3 border border-gray-300 focus:outline-none"
                        value={title}
                        onChange={(evt) => setTitle(evt.target.value)}
                    />

                    {/* ASS RIPPING FOR onChange={content} BECAUSE IT HAS TO BE A FUNC */}
                    <PostTextEditor
                        ref={editorRef}
                        value={content}
                        onChange={setContent}
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

                    <div className="border border-gray-200 p-4 bg-gray-50">
                        <h3 className="text-gray-700">LIVE PREVIEW:</h3>
                        <img src={previewUrl} className="w-xs h-xs" />
                        <div className="tiptap" dangerouslySetInnerHTML={{ __html: content }} />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 text-white bg-green-800 cursor-pointer hover:bg-green-500 transition"
                    >
                        APPLY CHANGES!
                    </button>
                </div>)
            }
        </form>
    )
}

export default EditPost
