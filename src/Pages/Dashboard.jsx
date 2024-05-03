import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LogoutButton from '../Components/LogOut';
import axios from 'axios';

function Dashboard() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // Check session storage for the existence of idToken
        if (sessionStorage.getItem('idToken')) {
            setLoggedIn(true);
            fetchProjects();
        } else {
            navigate('/');
        }
    }, [navigate]);

    const fetchProjects = async () => {
        try {
            const bearerToken = sessionStorage.getItem('idToken');
            const response = await axios.get('http://localhost:3000/getOwnProjects', {
                headers: {
                    'Authorization': `Bearer ${bearerToken}`
                }
            });
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleStartProject = () => {
        // Add logic to start a project
        console.log('Starting a new project...');
        navigate('/startProject');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {loggedIn ? (
                <div className="flex flex-col items-center space-y-4">
                    <div className="text-2xl font-bold">You can buy, sell, or rent</div>
                    <button
                        onClick={handleStartProject}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:ring focus:ring-blue-200"
                    >
                        Start a Project
                    </button>
                    <div className="mt-4">
                        {projects.length > 0 ? (
                            <div>
                                <h2 className="text-xl font-semibold">Your Started Projects:</h2>
                                {projects.map((project, index) => (
                                    <div key={index} className="mt-2">
                                        <Link
                                            to={`/projectDetails/${project._id}`}
                                            className="text-blue-500 hover:underline"
                                        >
                                            {project.name}
                                        </Link>
                                        <p>Starting Date: {new Date(project.startedAt).toLocaleDateString()}</p>
                                        <p>Type: {project.type}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <p className="text-xl">You haven't started any projects yet.</p>
                                <p className="text-lg">Start a project to get started!</p>
                            </div>
                        )}
                    </div>
                    <LogoutButton />
                </div>
            ) : null}
        </div>
    );
}

export default Dashboard;
