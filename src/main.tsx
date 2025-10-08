import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="608470752767-176m6b3rl8s03ujp9pk1phsmk54k3628.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
