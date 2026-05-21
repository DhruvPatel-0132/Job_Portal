import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

/* ✅ ZUSTAND */
import { useAuthStore } from "./store/authStore";

/* 🔥 INIT AUTH */
function InitAuth() {
  const token = useAuthStore((state) => state.token);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const init = async () => {
      try {
        if (token) {
          await fetchUser();
        }
      } catch (err) {
        logout(); // 🔥 clear bad token
      }
    };

    init();
  }, [token]);

  return null;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        
        {/* 🔥 AUTO USER LOAD */}
        <InitAuth />

        <App />

      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);