import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskList from './pages/TaskList';
import TaskForm from './pages/TaskForm';
import EditTask from './pages/EditTask';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={
          <PrivateRoute>
            <TaskList />
          </PrivateRoute>
        } />
        <Route path="/tasks/new" element={
          <PrivateRoute>
            <TaskForm />
          </PrivateRoute>
        } />
        <Route path="/tasks/:id/edit" element={
          <PrivateRoute>
            <EditTask />
          </PrivateRoute>
        } />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
