import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
	authToken: any;
	updateAuthToken: (token : string) => void;
	login: (username: string, password: string) => Promise<string>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken"));

	const updateAuthToken = (token : string) => {
		  localStorage.setItem("authToken", token);
      setAuthToken(token);
	  }

	const login = async (username: string, password: string) => {
		const url = "http://localhost:3001/api/auth/login"
		try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, password : password})
      })

      switch (response.status) {
        case 200:
          const result = await response.json();
          updateAuthToken(result.token);
          return "ok";
        case 404:
          return "user";
        case 401:
          return "password";
        default:
          throw new Error(`Response Login status: ${response.status}`) 
      }
      
		} catch (error : unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      return "user";
    }
	};
	
	const logout = () => {
		localStorage.removeItem("token");
		setAuthToken(null);
	};

	return (
		<AuthContext.Provider value={{ authToken, updateAuthToken, login, logout}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);

	if (!ctx) throw new Error("useAuth must come from AuthProvider");

	return ctx;
}
