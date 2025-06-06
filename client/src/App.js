import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import ImageDetails from './pages/ImageDetails';
import UserProfile from './pages/UserProfile';
import Error from './pages/Error';
import Plus from './pages/Plus';
import './App.css';
import SharedLayout from './components/SharedLayout';

import { useAuthContext } from './hooks/useAuthContext';
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import UploadImage from './pages/UploadImage';
import EditModal from './components/EditModal'

function App() {
  const { user } = useAuthContext();
  return (
    <>
      <Routes>
        {/* TODO: Modify these navigate links */}
        {/* <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} /> */}
        <Route path="/upload" element={user ? <UploadImage /> : <Login />} />

        <Route path="/" element={<SharedLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={user ? <Navigate to={-1} /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to={-1} /> : <Signup />} />
          <Route path="s/photos/:query" element={<SearchPage />} />
          <Route path="photos/:id" element={<ImageDetails />} />
          <Route path="plus" element={<Plus />} />
          <Route path="/user/:username" element={<UserProfile />} />
          {/* <Route path='*' element={<Error />} /> */}
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
