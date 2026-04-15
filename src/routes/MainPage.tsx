import { ReviewManager } from "../components/ReviewManager";
import { Link } from "react-router-dom";

export function MainPage() {
	return (
		<div style={{width: '100%'}}>
			<nav className="nav_user">
				<Link to="/login">Login</Link>
				<Link to="/register">Registrar</Link>
			</nav>
			<div className="app">
				<h1>Calendário de Revisões</h1>
				<ReviewManager />
			</div>
		</div>
	);
}

export default MainPage;
