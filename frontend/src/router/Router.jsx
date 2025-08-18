import { createBrowserRouter } from "react-router-dom";
import App from "../App"
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import About from "../pages/About";
import Contact from "../pages/Contact";
import UserSearch from "../pages/UserSearch";
import Profile from "../pages/Profile";
import UpdateUser from "../pages/UpdateUser";
import PrivateRoute from "../components/PrivateRoute"; 
import Posts from "../pages/Posts";
import CreatePost from "../pages/CreatePost";
import Friends from "../pages/Friends";
import FriendInbox from "../pages/FriendInbox";
import Sent from "../pages/Sent";
import PostDetail from "../pages/PostDetail"
import EditPost from "../pages/EditPost";
import Unauthorized from "../pages/Unauthorized";

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
                    { path: "/profile", element: <Profile /> },
                    { path: "/profile/update", element: <UpdateUser /> },
                    { path: "/posts", element: <Posts /> },
                    { path: "/posts/create", element: <CreatePost /> },
                    { path: "/friends", element: <Friends /> },
                    { path: "/inbox", element: <FriendInbox /> },
                    { path: "/sent", element: <Sent /> },
                    { path: "/search", element: <UserSearch /> },
                    { path: "/posts/:id", element: <PostDetail /> },
                    { path: "/posts/:id/edit", element: <EditPost /> }, 
                ]
            }
        ]
    }
]);

export default router;
