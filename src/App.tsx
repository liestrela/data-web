import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainPage from "./routes/MainPage";
import Login from "./routes/Login";

import "./styles/main.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: <MainPage />,
	},
	{
		path: "/login",
		element: <Login />,
	},
]);

export function App() {
  return <RouterProvider router={router} />;
}

export default App;
