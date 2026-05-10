import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import defaultUserImage from "../assets/default.svg";

export function Navbar() {
	const { authToken, logout } = useAuth();
	const [userDropdown, setUserDropdown] = useState(false);

	if (authToken) {
		return (
			<nav className="nav_user">
				<img
					src={defaultUserImage}
					alt="Imagem do usuário"
					onClick={() => setUserDropdown(!userDropdown)}
				/>

				{userDropdown && (
					<div className="user_drop">
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
