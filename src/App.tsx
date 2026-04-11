import { ReviewManager } from "./components/ReviewManager";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import "./index.css";

export function App() {
  
  return (
    <div className="app">
      <h1>Calendário de Revisões</h1>
      <ReviewManager />
    </div>
  );
}
