import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import defaultUserImage from "../assets/default.svg";

export function Navbar() {
  const { authToken, logout } = useAuth();
  const [userDropdown, setUserDropdown] = useState(false);
  const [dropdownClosing, setDropdownClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  const toggleDropdown = () => {
    if (userDropdown) {
      setDropdownClosing(true);
      closeTimer.current = setTimeout(() => {
        setUserDropdown(false);
        setDropdownClosing(false);
      }, 180);
    } else {
      clearTimeout(closeTimer.current);
      setDropdownClosing(false);
      setUserDropdown(true);
    }
  };

  if (authToken) {
    return (
      <nav className="nav_user">
        <span></span>
        <img
          src={defaultUserImage}
          alt="Imagem do usuário"
          onClick={toggleDropdown}
        />

        {userDropdown && (
          <div className={`user_drop${dropdownClosing ? " closing" : ""}`}>
            <ul>
              <li onClick={logout}>Logout</li>
            </ul>
          </div>
        )}
      </nav>
    );
  } else {
    return (
      <nav className="nav_user">
        <Link to="/login">Login</Link>
        <Link to="/register">Registrar</Link>
      </nav>
    );
  }
}

export default Navbar;
