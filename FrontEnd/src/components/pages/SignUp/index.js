import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const SignUp = () => {
    useEffect(() => {
        document.title = "Sign Up | Hire IT";
    }, []);
    return (
        <div>
            <Outlet />
        </div>
    );
};

export default SignUp;
