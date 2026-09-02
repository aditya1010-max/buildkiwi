import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeProvider";
import { LanguageProvider } from "./providers/LanguageProvider";

import App from "./App";

import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/globals.css";

import { ProgressProvider } from "./providers/ProgressProvider";
import TopLoadingBar from "./components/project/shared/TopLoadingBar/TopLoadingBar";
import { ToastProvider } from "./context/ToastProvider";

import NavigationSnapshotProvider from "./navigation/NavigationSnapshotProvider";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <NavigationSnapshotProvider>
      <ThemeProvider>
        <LanguageProvider>
          <ProgressProvider>
            <TopLoadingBar />

            <ToastProvider>
              <App />
            </ToastProvider>
          </ProgressProvider>
        </LanguageProvider>
      </ThemeProvider>
    </NavigationSnapshotProvider>
  </BrowserRouter>,
);
