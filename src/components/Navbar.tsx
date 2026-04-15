import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import defaultUserImage from "../assets/default.svg";

export function Navbar() {
	const { user, logout } = useAuth();
	const [userDropdown, setUserDropdown] = useState(false);

	return (
		<div>
			{!user ? (
				<nav className="nav_user">
					<Link to="/login">Login</Link>
					<Link to="/register">Registrar</Link>
				</nav>
			) : (
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
			)}
		</div>
	);
}

export default Navbar;
