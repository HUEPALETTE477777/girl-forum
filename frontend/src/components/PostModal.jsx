import React from 'react'

const PostModal = ({ show, close, confirm }) => {
    return (
        <>
            {
                show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="bg-gray-800 border max-w-5xl p-16">
                            <h1 className="text-4xl text-center text-white">DO YOU WANT DELETE MY FRIEND</h1>
                            <div className="text-4xl flex gap-4 p-5 text-white">
                                <button className="bg-red-700 cursor-pointer hover:bg-red-500" onClick={confirm}>YES DELETE THE POST</button>
                                <button className="bg-green-700 cursor-pointer hover:bg-green-500" onClick={close}>CANCEL</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default PostModal
