import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

const root_e = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (import.meta.hot) {
  const root = (import.meta.hot.data.root ??= createRoot(root_e));
  root.render(app);
} else {
  /* production */
  createRoot(root_e).render(app);
}
