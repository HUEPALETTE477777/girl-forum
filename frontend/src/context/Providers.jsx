
import React from 'react';
import { AuthProvider } from './AuthContext.jsx';
import { PostProvider } from './PostContext.jsx';
import { FriendProvider } from './FriendContext.jsx';
import { CommentProvider } from './CommentContext.jsx';
import { ReelProvider } from './ReelContext.jsx';


const Providers = ({ children }) => {
    return (
        <AuthProvider>
            <PostProvider>
                <FriendProvider>
                    <CommentProvider>
                        <ReelProvider>
                            {children}
                        </ReelProvider>
                    </CommentProvider>
                </FriendProvider>
            </PostProvider>
        </AuthProvider>
    );
};

export default Providers;
