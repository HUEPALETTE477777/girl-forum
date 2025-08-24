import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; 
    }

    if (!user) {
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
