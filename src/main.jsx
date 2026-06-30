import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { SocialLogin } from "@capgo/capacitor-social-login";

import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

async function startApp() {
  if (Capacitor.isNativePlatform()) {
    await SocialLogin.initialize({
      google: {
        webClientId:
          "604290075583-ii8h856p2ufoh9cqqbqefjadopipkv0p.apps.googleusercontent.com",
        mode: "online",
      },
    });
  }

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

startApp();