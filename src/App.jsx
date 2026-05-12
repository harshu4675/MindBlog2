import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { BlogProvider } from "./context/BlogContext";
import { AnalyticsProvider } from "./context/AnalyticsContext";
import AppRoutes from "./routes/AppRoutes";
import Toast from "./components/Toast/Toast";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <BlogProvider>
              <AnalyticsProvider>
                <ScrollToTop />
                <AppRoutes />
                <Toast />
              </AnalyticsProvider>
            </BlogProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
