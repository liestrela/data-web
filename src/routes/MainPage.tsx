import { ReviewManager } from "../components/ReviewManager";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import defaultUserImage from '../assets/default.jpg'
import { useState } from "react";

export function MainPage() {
  const { user, logout } = useAuth();
  const [isUserOpen, setIsUserOpen] = useState(false);

	return (
		<div style={{width: '100%'}}>

			{!user ? (
				<nav className="nav_user">
					<Link to="/login">Login</Link>
					<Link to="/register">Registrar</Link>
				</nav>
			) : (
				<nav className="nav_user">
          <img 
            src={defaultUserImage} 
            alt="Imagem do usuário."
            onClick={() => setIsUserOpen(!isUserOpen)} 
          />

          {isUserOpen && (
            <div className="user_drop">
              <ul>
                <li onClick={logout}>Logout</li>
              </ul>
            </div>
            )
          }
				</nav>
			)}

			<div className="app">
				<h1>Calendário de Revisões</h1>
				<ReviewManager />
			</div>
		</div>
	);
}

export default MainPage;
