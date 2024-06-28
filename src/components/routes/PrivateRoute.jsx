/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import Loader from "../../common/Loader/index";


const PrivateRoute = ({ component: Component, roles, ...rest }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <Loader />;

    return (
        <Route
            {...rest}
            render={props =>
                user && (!roles || roles.includes(user.role)) ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: '/auth/signin', state: { from: props.location } }} />
                )
            }
        />
    );
};

export default PrivateRoute;
