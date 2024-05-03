import React, { useState,useEffect } from 'react';
import axios from 'axios'; // You need to install axios for HTTP requests
import { useNavigate } from 'react-router-dom';

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: ''
  });
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check session storage for the existence of idToken
    if (sessionStorage.getItem('idToken')) {
      setLoggedIn(true);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null); // Reset error state
      const bearerToken = sessionStorage.getItem('idToken');
      const response = await axios.post(
        'http://localhost:3000/startProject',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerToken}`
          }
        }
      );
      console.log(response.data); // Logging the response data, you can handle it as needed
      // Optionally, you can reset the form after successful submission
      setFormData({
        name: '',
        type: '',
        description: '',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.'); // Set error state
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex items-center justify-center px-4">
      {loggedIn ? (
      <div className="bg-gray-700 rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-200">Start a New Project</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>} {/* Error message */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 text-gray-200">Project Name:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md bg-gray-800 text-gray-200 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="block mb-1 text-gray-200">Type:</label>
            <input
              id="type"
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md bg-gray-800 text-gray-200 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block mb-1 text-gray-200">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md bg-gray-800 text-gray-200 focus:outline-none focus:border-blue-500"
              required
            ></textarea>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Submit</button>
        </form>
      </div>
      ) : null}
    </div>
  );
};

export default ProjectForm;
