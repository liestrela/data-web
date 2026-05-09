import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
	user: any;
	login: (token: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState(() => localStorage.getItem("token"));

	const login = (token: string) => {
		localStorage.setItem("token", token);
		setUser(token);
	};
	
	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);

	if (!ctx) throw new Error("useAuth must come from AuthProvider");

	return ctx;
}
