import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { BookmarkProvider } from "../src/context/BookmarkContext";
import { LikeProvider } from "./context/LikeContext";

import App from "./App";
import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <BookmarkProvider>
        <LikeProvider>
          <App />
        </LikeProvider>
      </BookmarkProvider>
    </BrowserRouter>
  </StrictMode>,
);
