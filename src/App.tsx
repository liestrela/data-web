import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import AuthGuard from "./components/AuthGuard";
import MainPage from "./routes/MainPage";
import Login from "./routes/Login";
import Register from "./routes/Register";

import "./styles/main.css";

const router = createBrowserRouter([
	{
		element: <AuthGuard />,
		children: [
			{
				path: "/",
				element: <MainPage />,
			},
		],
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/register",
		element: <Register />,
	},
]);

export function App() {
  return (
	  <AuthProvider>
		  <RouterProvider router={router} />
	  </AuthProvider>
  );
}

export default App;
