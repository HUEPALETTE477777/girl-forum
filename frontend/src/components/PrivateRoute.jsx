import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { user, currentAuthError } = useAuth();

    if (!user) {
        return <Navigate to="/unauthorized"/>;
    }

   return <Outlet />;
};

export default PrivateRoute;
