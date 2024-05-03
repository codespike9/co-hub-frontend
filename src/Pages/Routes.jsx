import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import ProjectForm from './ProjectForm';
import ProjectDetails from './ProjectDetails';

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/startProject' element={<ProjectForm/>} />
      <Route path = '/projectDetails/:projectId' element={<ProjectDetails/>} />
    </Routes>
  );
}

export default AppRoutes;
