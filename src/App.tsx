import { ReviewManager } from "./components/ReviewManager";
import "./index.css";

export function App() {
  return (
    <div className="app">
      <h1>Calendário de Revisões</h1>
      <ReviewManager />
    </div>
  );
}
