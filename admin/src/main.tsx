import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ProductProvider } from "./context/ProductProvider.tsx";
import { AdminProvider } from "./context/AdminProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <AdminProvider>
        <ProductProvider>
          <App />
        </ProductProvider>
      </AdminProvider>
    </StrictMode>
  </BrowserRouter>,
);
