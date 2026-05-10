import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AuthGuard() {
	const { authToken } = useAuth();
	const location = useLocation();

	if (!authToken) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <Outlet />;
}

export default AuthGuard;
