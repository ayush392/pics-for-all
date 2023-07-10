import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Topics from './pages/Topics';
import SearchPage from './pages/SearchPage';
import ImageDetails from './pages/ImageDetails';
import UserProfile from './pages/UserProfile';
import Error from './pages/Error';
import Plus from './pages/Plus';
import './App.css';
import SharedLayout, {SharedLayout2} from './components/SharedLayout';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<SharedLayout />} >
          <Route index element={<Home />} />
          <Route path='t/:slugId' element={<Topics />} />
          <Route path='s/photos/:query' element={<SearchPage />} />
          <Route path='photos/:id' element={<ImageDetails />} />
          <Route path='plus' element={<Plus />}/>
          <Route path='user/:userName/' element={<SharedLayout2 />}>
            <Route index element={<UserProfile val='photos'/>} />
            <Route path='likes' element={<UserProfile val='likes'/>} />
          </Route>
          {/* <Route path='*' element={<Error />} /> */}
        </Route>
        <Route path='*' element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
