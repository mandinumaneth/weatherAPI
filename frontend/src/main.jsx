import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import App from "./App.jsx";

const domain = "dev-fdjyqqnyvd12ig7u.us.auth0.com";
const clientId = "xWrd7CFogLQpb4w3THmcu8iqMCj5oYJe";
const audience = "https://weatherapp-api";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
        scope: "openid profile email",
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
