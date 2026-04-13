import { ReviewManager } from "./components/ReviewManager";

import Calendar from "react-calendar";
import "./calendar.css";

import "./index.css";

export function App() {
  return (
    <div className="app">
      <h1>Calendário de Revisões</h1>
      <ReviewManager />
	  <Calendar className="calendar" />
    </div>
  );
}
