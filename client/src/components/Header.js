import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
// import './App.css';

function Header() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    setQuery(e.target.value);
    // console.log(query);
  }

  function handleClick(){
    navigate(`/s/photos/${query}`);
  }

  return (
    <>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
        <h1><Link to={'/'} className="navbar-brand">PicsForAll</Link></h1>
          <form onSubmit={e=> e.preventDefault()} className="d-flex" role="search">
            <input className="form-control me-2" type="search" value={query} onChange={handleChange} placeholder="Search images" aria-label="Search" />
              <button onClick={handleClick} className="btn btn-outline-success" type="submit">Search</button>
          </form>
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