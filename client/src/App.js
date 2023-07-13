import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home2';
import Topics from './pages/Topics';
import SearchPage from './pages/SearchPage';
import ImageDetails from './pages/ImageDetails';
import UserProfile from './pages/UserProfile';
import Error from './pages/Error';
import Plus from './pages/Plus';
import './App.css';
import SharedLayout, { SharedLayout2 } from './components/SharedLayout';

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
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/upload' element={<UploadImage />} />
        <Route path='/edit' element={<EditModal />} />

        <Route path='/' element={<SharedLayout />} >
          <Route index element={<Home />} />
          <Route path='t/:slugId' element={<Topics />} />
          <Route path='s/photos/:query' element={<SearchPage />} />
          <Route path='photos/:id' element={<ImageDetails />} />
          <Route path='plus' element={<Plus />} />
          <Route path='user/:userName/' element={<SharedLayout2 />}>
            <Route index element={<UserProfile val='photos' />} />
            <Route path='likes' element={<UserProfile val='likes' />} />
          </Route>
          {/* <Route path='*' element={<Error />} /> */}
        </Route>
        <Route path='*' element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
