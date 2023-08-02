import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext';
// import './App.css';

function Header() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    setQuery(e.target.value);
    // console.log(query);
  }

  function handleSearch() {
    navigate(`/s/photos/${query}`);
  }

  function handleClick() {
    user ? navigate('/upload') : navigate('/login')
  }

  return (
    <>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">

          <h1><Link to={'/'} className="navbar-brand">PicsForAll</Link></h1>

          <button type="button" onClick={() => navigate('/plus')} className="btn btn-outline-info">PicsForAll+</button>

          <form onSubmit={e => e.preventDefault()} className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              value={query}
              onChange={handleChange}
              placeholder="Search images"
              aria-label="Search"
            />
            <button onClick={handleSearch} className="btn btn-primary" type="submit">Search</button>
          </form>

          <button type="button" onClick={handleClick} className="btn btn-outline-success">Submit a photo</button>

          <div>
            {
              user ? <div>
                <span className='me-2'>{user.email}</span>
                <button className='btn btn-outline-danger' onClick={() => logout()}>Log Out</button>
              </div>
                :
                <div>
                  <Link className='me-2 btn btn-outline-primary' to={'/login'}>Login</Link>
                  <Link className='btn btn-outline-primary' to={'/signup'}>Signup</Link>
                </div>
            }
          </div>
          {/* <button type="button" className="btn btn-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            Download free
          </button>
          <ul className="dropdown-menu">
            <li><button className="dropdown-item">Small</button></li>
            <li><button className="dropdown-item"  >Medium</button></li>
            <li><button className="dropdown-item" >Large</button></li>
            <li><hr className="dropdown-divider" /></li>
            <li><button className="dropdown-item">Original Size</button></li>
          </ul> */}
        </div>
      </nav>

      {/* <div>
        <h2 onClick={() => navigate('/')}>PicsForALL</h2>
        <form onClick={e => e.preventDefault()}>
          <input value={query} onChange={handleChange} />
          <button onClick={() => console.log(query)}>Search</button>
          <Link to={`/s/photos/${query}`}>Search</Link>
        </form>
        <hr></hr>
      </div> */}

    </>
  )
}

export default Header;