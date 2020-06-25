import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';


export const   PrivateRoute = ({ component: Component, ...rest }) => {
    const isLogin = useSelector(state=>state.isLogin);
    return <Route {...rest} render={(props) => (
        isLogin === true
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
    }