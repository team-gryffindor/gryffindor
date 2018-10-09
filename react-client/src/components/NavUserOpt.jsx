import React from 'react';
import firebase from 'firebase';
import { Link } from 'react-router-dom';

const NavUserOpt = (prop) => (
  <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
    <ul className="navbar-nav ml-auto">
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <i className="fas fa-user" />
        </a>

        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
          <a className="dropdown-item">
            <Link to="/dashboard">Dashboard</Link>
          </a>
          <a className="dropdown-item">
            <Link to="/userProfile">Profile</Link>
          </a>
          <div className="dropdown-divider" />
          <a
            className="dropdown-item"
            onClick={() => {
              firebase
                .auth()
                .signOut()
                .then(() => prop.handleLogin());
            }}
          >
            <Link to="/">Logout</Link>
          </a>
        </div>
      </li>
    </ul>
  </div>
);

export default NavUserOpt;
