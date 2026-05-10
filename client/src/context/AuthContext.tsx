import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
	user: any;
	login: (username: string, password: string) => Promise<boolean>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState(() => localStorage.getItem("token"));

	const login = async (username: string, password: string) => {
		const url = "http://localhost:3001/api/auth/login"
		try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, password : password})
      })

      if (!response.ok) {
        throw new Error(`Response login status: ${response.status}`)
      }

      const result = await response.json();
      
      if (result.message === "Ok") {
        localStorage.setItem("token", username);
        setUser(username);
        return true;
      } else
        return false;

		} catch (error : unknown) {
      if (error instanceof Error)
        console.error(error.message);
      }
      return false;
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
