import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProjectDetails = () => {
    const { projectId } = useParams(); // Get the projectId from the URL
    const [project, setProject] = useState(null); // State to store project details
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
    const [messages, setMessages] = useState([]); // State to store chat messages
    const [inputMessage, setInputMessage] = useState(''); // State to store user input message
    const navigate = useNavigate();
    const chatContainerRef = useRef(null);

    useEffect(() => {
        // Check if the user is logged in
        const checkLoginStatus = () => {
            const idToken = sessionStorage.getItem('idToken');
            if (idToken) {
                setIsLoggedIn(true);
            }
        };

        checkLoginStatus(); // Check login status when the component mounts
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            // Fetch project details from the backend API
            const fetchProjectDetails = async () => {
                try {
                    const bearerToken = sessionStorage.getItem('idToken');
                    const response = await axios.get(`http://localhost:3000/getProjectDetails/${projectId}`, {
                        headers: {
                            'Authorization': `Bearer ${bearerToken}`
                        }
                    });
                    console.log(response.data.name);
                    setProject(response.data); // Set the project details in state
                } catch (error) {
                    console.error('Error fetching project details:', error);
                }
            };

            fetchProjectDetails(); // Call the fetchProjectDetails function when the user is logged in
        }
    }, [projectId, isLoggedIn]);

    useEffect(() => {
        // Scroll to the bottom of the chat container when messages change
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    if (!isLoggedIn) {
        // Redirect to login page if user is not logged in
        return navigate('/');
    }

    // Function to send a message to the chat
    // Function to send a message to the chat
    const sendMessage = async () => {
        if (inputMessage.trim() === '') return;

        try {
            const bearerToken = sessionStorage.getItem('idToken');
            const response = await axios.post(
                `http://localhost:3000/cohubChatBot`,
                { prompt: inputMessage },
                {
                    headers: {
                        'Authorization': `Bearer ${bearerToken}`
                    }
                }
            );

            setMessages(prevMessages => [
                ...prevMessages,
                { text: inputMessage, sender: 'user' }, // Add user message
                { text: response.data, sender: 'bot' } // Add bot response
            ]);
            setInputMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };


    return (
        <div className="container mx-auto mt-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
                {project ? (
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">{project.name}</h2>
                        <p className="text-gray-600 mb-4">Starting Date: {new Date(project.startedAt).toLocaleDateString()}</p>
                        <p className="text-gray-600 mb-4">Type: {project.type}</p>
                        <p className="text-gray-600">Description: {project.description}</p>
                        <p className="text-gray-600">Description: {project.llm_description}</p>
                        {/* Render other project details here */}
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>

            {/* Chat Screen */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Chat Screen</h3>
                <div className="bg-gray-100 p-4 rounded-lg shadow-lg overflow-y-auto max-h-96" ref={chatContainerRef}>
                    {/* Chat messages */}
                    <div className="flex flex-col space-y-2">
                        {messages.map((message, index) => (
                            <div key={index} className={`text-sm p-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                <div className={`rounded-lg p-2 max-w-md ${message.sender === 'user' ? 'bg-blue-400 text-white self-end' : 'bg-gray-200 self-start'}`}>
                                    {message.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Input field for typing messages */}
                <div className="flex mt-4">
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none"
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={e => setInputMessage(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md"
                        onClick={sendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
