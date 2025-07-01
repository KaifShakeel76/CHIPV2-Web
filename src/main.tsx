// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";


import { store } from "./app/store";

 import { Toaster } from "sonner";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster richColors position="top-center" />
    </Provider>
  </React.StrictMode>
);
