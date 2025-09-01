import { createBrowserRouter } from "react-router-dom";
import App from "../App"
import Home from "../pages/Home";
import Signup from "../pages/Auth/Signup";
import Login from "../pages/Auth/Login";
import About from "../pages/About";
import Contact from "../pages/Contact";
import UserSearch from "../pages/Auth/UserSearch";
import UserProfile from "../pages/Auth/UserProfile";
import UpdateUser from "../pages/Auth/UpdateUser";
import PrivateRoute from "../components/PrivateRoute"; 
import Posts from "../pages/Post/Posts";
import CreatePost from "../pages/Post/CreatePost";
import Friends from "../pages/Auth/Friends";
import FriendInbox from "../pages/Auth/FriendInbox";
import Sent from "../pages/Auth/Sent";
import PostDetail from "../pages/Post/PostDetail"
import EditPost from "../pages/Post/EditPost";
import Unauthorized from "../pages/Auth/Unauthorized";
import UserTargetProfile from "../pages/Auth/UserTargetProfile";
import Reel from "../pages/Reel/Reel";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/signup", element: <Signup /> },
            { path: "/login", element: <Login /> },
            { path: "/about", element: <About /> },
            { path: "/contact", element: <Contact /> },
            { path: "/unauthorized", element: <Unauthorized /> },

            // PROTECTED ROUTES BELOW
            {
                element: <PrivateRoute />, 
                children: [
                    { path: "/profile", element: <UserProfile /> },
                    { path: "/profile/:id", element: <UserTargetProfile /> },
                    { path: "/profile/update", element: <UpdateUser /> },
                    { path: "/posts", element: <Posts /> },
                    { path: "/posts/create", element: <CreatePost /> },
                    { path: "/friends", element: <Friends /> },
                    { path: "/inbox", element: <FriendInbox /> },
                    { path: "/sent", element: <Sent /> },
                    { path: "/search", element: <UserSearch /> },
                    { path: "/posts/:id", element: <PostDetail /> },
                    { path: "/posts/:id/edit", element: <EditPost /> },
                    { path: "/reels", element: <Reel /> }, 
                ]
            }
        ]
    }
]);

export default router;
