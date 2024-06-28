// src/components/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../styles/Loader';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return <Loader />;
    }

    return isAuthenticated() ? <Outlet /> : <Navigate to="/auth/signin" />;
};

export default ProtectedRoute;
