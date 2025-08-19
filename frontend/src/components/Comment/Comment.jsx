import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import CommentReplyField from './CommentReplyField';
import CommentEditField from './CommentEditField';
import DateFormat from '../../utils/FormatDate';

import { useComment } from '../../context/CommentContext';
import { useAuth } from '../../context/AuthContext';

const Comment = ({ c }) => {
    const { user } = useAuth();
    const [hasClickedReplyButton, setHasClickedReplyButton] = useState(false);
    const [hasClickedEditButton, setHasClickedEditButton] = useState(false);

    const { id } = useParams();

    const handleEditButtonClick = () => {
        setHasClickedEditButton(prev => !prev);
    };

    const handleReplyButtonClick = () => {
        setHasClickedReplyButton(prev => !prev);
    };

    const handleEditButtonSubmitted = () => {
        setHasClickedEditButton(false);
    };

    const handleReplyButtonSubmitted = () => {
        setHasClickedReplyButton(false);
    };

    return (
        <div className="bg-gray-600 p-4 mb-4 border border-gray-500">
            <div className="flex items-center gap-4 mb-2">
                <img src={c.commenter?.avatar} className="w-16 h-16 object-cover border border-gray-500" />
                <div className="flex flex-col">
                    <h2 className="text-lg">USER: {c.commenter.username}</h2>
                    <p>USER ID: {c.commenter.user_id}</p>
                </div>

                {/* EDIT BUTTON */}
                {user?.user_id == c.commenter.user_id && !hasClickedReplyButton && (
                    <button
                        className={`cursor-pointer ${hasClickedEditButton ? 'bg-gray-800' : 'bg-blue-700'} text-white px-3 py-1`}
                        onClick={handleEditButtonClick}
                    >
                        {hasClickedEditButton ? "COLLAPSE" : "EDIT"}
                    </button>
                )}

                {/* REPLY BUTTON */}
                {!hasClickedEditButton && (
                    <button
                        className={`cursor-pointer ${hasClickedReplyButton ? 'bg-gray-800' : 'bg-green-400'} text-white px-3 py-1`}
                        onClick={handleReplyButtonClick}
                    >
                        {hasClickedReplyButton ? "COLLAPSE" : "REPLY"}
                    </button>
                )}
            </div>

            <CommentEditField
                initialComment={c?.comment}
                initialImage={c?.image}
                commentId={c?.comment_id}
                hasClickedEditButton={hasClickedEditButton}
                onEditSubmitted={handleEditButtonSubmitted}
            />

            <CommentReplyField
                comment_id={c.comment_id}
                hasClickedReplyButton={hasClickedReplyButton}
                onReplySubmitted={handleReplyButtonSubmitted}
            />

            <p className="text-sm">CREATED AT: {DateFormat(c.createdAt)}</p>
            <p className="text-sm mb-2">UPDATED AT: {DateFormat(c.updatedAt)}</p>

            {c.replies?.length > 0 && (
                <div className="ml-6 border-l border-gray-700 pl-4">
                    {c.replies.map(reply => (
                        <div key={reply._id} className="relative before:absolute before:top-1/2 before:-left-4 before:w-4 before:border-t before:border-gray-700">
                            <Comment c={reply} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comment;
