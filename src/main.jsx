import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/react";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
<<<<<<< HEAD
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
      <Analytics />
    </>
=======
    <GoogleOAuthProvider clientId={clientId}>
      <App />
      <Analytics />
    </GoogleOAuthProvider>
>>>>>>> c16ba9dc931d6ceab09d3860d68ef97bb1f9feb0
  </React.StrictMode>,
);
