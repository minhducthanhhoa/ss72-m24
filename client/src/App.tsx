import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NewPostForm from './components/NewPostForm';
import PostsList from './components/PostsList';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PostsList />} />
      <Route path="/new" element={<NewPostForm />} />
    </Routes>
  );
};

export default App;
