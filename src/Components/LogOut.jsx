import React from 'react';
import { useNavigate } from 'react-router-dom';


function LogOutButton() {

    const navigate=useNavigate();

    const handleLogout=()=>{
        sessionStorage.removeItem('idToken');
        navigate('/');
    }

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-red-200"
        >
            Logout
        </button>
    )
}

export default LogOutButton;
