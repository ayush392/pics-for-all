import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import "./gallery.css";
import Avatar from "./Avatar";
import GradientText from "./GradientText";
import logo from "../icons/bitmap.webp";
import toast from "react-hot-toast";
import UploadModal from "./UploadModal";
import { useParams } from "react-router-dom";

function Header() {
  const { query: searchQuery } = useParams();
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [query, setQuery] = useState(searchQuery || "");
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  function handleSearch() {
    if (query === ""){
      toast.error("Please enter a word to search.");
      return;
    };
    navigate(`/s/photos/${query}`);
  }

  function handleClick() {
    user ? setModalOpen(true) : toast.error("Please login to submit a photo");
  }

  useEffect(()=>{
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [searchQuery])

  return (
    <>
      {/* --------------------MOBILE----------------------------- */}
      <nav className="navbar align-items-center sticky-top bg-white shadow-sm mobile">
        <Link
          to={"/"}
          className="d-flex align-items-center navbar-brand m-0 p-0 ms-2 ps-1"
        >
          <img src={logo} alt="logo" width="34" />
          <div className="h4 m-0 ms-1">PFA</div>
        </Link>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-50"
          role="search"
        >
          <div className="input-group">
            <input
              className="form-control"
              type="search"
              value={query}
              onChange={handleChange}
              placeholder="Search images"
              required
              aria-label="Search"
              aria-describedby="mobile-search-btn"
            />
            <button
              onClick={handleSearch}
              className="btn border border-start-0 btn-sm"
              type="submit"
              id="mobile-search-btn"
            >
              <svg
                fill="#6D6D6D"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 30"
                width="18px"
                height="18px"
              >
                <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z" />
              </svg>
            </button>
          </div>
        </form>

        <div className=" me-2 pe-1">
          {user ? (
            <div className="btn-group">
              <span
                role="button"
                data-bs-toggle="dropdown"
                data-bs-display="static"
                aria-expanded="false"
              >
                <Avatar
                  w="2rem"
                  avatar={user?.avatar}
                />
              </span>
              <ul
                className="dropdown-menu dropdown-menu-start"
                style={{ translate: "-80%" }}
              >
                <li>
                  <Link
                    to={`../user/${user?.username}`}
                    className="dropdown-item"
                  >
                    View Profile
                  </Link>
                </li>
                <li>
                  <button onClick={handleClick} className="dropdown-item">
                    Submit a photo
                  </button>
                </li>
                {/* <li>
                  <Link to={"/plus"} className="dropdown-item text-info">
                    <GradientText text="PicsForAll+" />
                  </Link>
                </li> */}
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => logout()}
                  >
                    Logout @{user?.username}
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link className="btn btn-sm btn-outline-dark" to={"/login"}>
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* -------------------DESKTOP-------------------------- */}

      <nav className="navbar align-items-center sticky-top bg-white shadow-sm desktop">
        <Link
          to={"/"}
          className=" d-flex align-items-center  navbar-brand ms-3"
        >
          <img src={logo} alt="logo" width="38" />
          <div className="h4 text-dark m-0 ms-1">PicsForAll</div>
        </Link>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-50"
          role="search"
        >
          <div className="input-group">
            <input
              className="form-control form-control-sm fs-6"
              type="search"
              value={query}
              onChange={handleChange}
              placeholder="Search images"
              aria-label="Search"
              aria-describedby="desktop-search-btn"
            />
            <button
              onClick={handleSearch}
              className="btn btn-sm btn-dark fs-6"
              type="submit"
              id="desktop-search-btn"
            >
              Search
            </button>
          </div>
        </form>
        <button
          type="button"
          className="btn btn-sm border-secondary invisible "
        >
          <GradientText text="PicsForAll+" />
        </button>
        <button
          type="button"
          onClick={handleClick}
          className="btn btn-sm btn-outline-dark fs-6"
        >
          Submit a photo
        </button>
        <div className=" me-3">
          {user ? (
            <div className="btn-group">
              <span
                role="button"
                data-bs-toggle="dropdown"
                data-bs-display="static"
                aria-expanded="false"
              >
                <Avatar
                  w="2.125rem"
                  avatar={user?.avatar}
                />
              </span>
              <ul
                className="dropdown-menu dropdown-menu-start"
                style={{ translate: "-80%" }}
              >
                <li>
                  <Link
                    to={`../user/${user?.username}`}
                    className="dropdown-item"
                  >
                    View Profile
                  </Link>
                </li>
                <li>
                  <button onClick={handleClick} className="dropdown-item">
                    Submit a photo
                  </button>
                </li>
                <li>
                  <Link to={"/plus"} className="dropdown-item text-info d-none">
                    <GradientText text="PicsForAll+" />
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => logout()}
                  >
                    Logout @{user?.username}
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link className="btn btn-sm btn-outline-dark fs-6" to={"/login"}>
              Login
            </Link>
          )}
        </div>
      </nav>

      <UploadModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  );
}

export default Header;
