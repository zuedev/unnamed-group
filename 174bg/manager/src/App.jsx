import { useCallback, useEffect, useState } from "react";
import { pb } from "./lib/pocketbase";
import Welcome from "./components/Welcome.jsx";
import RequiredInfo from "./components/RequiredInfo.jsx";
import RolePreferences from "./components/RolePreferences.jsx";
import OnCallSchedule from "./components/OnCallSchedule.jsx";
import Ledger from "./components/Ledger.jsx";

export default function App() {
  const [record, setRecord] = useState(pb.authStore.record);
  const [loggedIn, setLoggedIn] = useState(pb.authStore.isValid);
  const [loginDisabled, setLoginDisabled] = useState(false);
  const [oauthStatus, setOauthStatus] = useState({ text: "" });

  const refreshFromStore = useCallback(() => {
    setRecord(pb.authStore.record);
    setLoggedIn(pb.authStore.isValid);
  }, []);

  useEffect(() => pb.authStore.onChange(refreshFromStore), [refreshFromStore]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (pb.authStore.isValid) {
        try {
          await pb.collection("members").authRefresh();
        } catch {
          pb.authStore.clear();
        }
      }

      const oauthParams = new URLSearchParams(window.location.search);
      const storedProvider = localStorage.getItem("pb_oauth_provider");

      if (oauthParams.has("code") && oauthParams.has("state")) {
        if (!storedProvider) {
          setOauthStatus({
            text: "Login error: OAuth state lost (localStorage empty). Please try again.",
            variant: "error-plain",
          });
          window.history.replaceState({}, "", window.location.pathname);
        } else {
          setOauthStatus({ text: "Completing login..." });
          const provider = JSON.parse(storedProvider);
          localStorage.removeItem("pb_oauth_provider");
          const redirectUrl = window.location.origin + window.location.pathname;
          try {
            await pb
              .collection("members")
              .authWithOAuth2Code(
                provider.name,
                oauthParams.get("code"),
                provider.codeVerifier,
                redirectUrl,
              );
            setOauthStatus({ text: "✅ Login successful!", variant: "success" });
            window.history.replaceState({}, "", window.location.pathname);
            if (!cancelled) refreshFromStore();
          } catch (err) {
            console.error("OAuth callback failed:", err);
            const detail = [
              err?.message,
              err?.response ? JSON.stringify(err.response) : null,
              `code=${oauthParams.get("code")?.slice(0, 8)}…`,
              `state=${oauthParams.get("state")?.slice(0, 8)}…`,
              `redirect=${redirectUrl}`,
              `provider=${provider.name}`,
            ]
              .filter(Boolean)
              .join(" | ");
            setOauthStatus({
              text: `Login error — send this to your admin:\n${detail}`,
              variant: "error",
            });
            window.history.replaceState({}, "", window.location.pathname);
          }
        }
      } else if (!cancelled) {
        refreshFromStore();
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [refreshFromStore]);

  const handleLogin = useCallback(async () => {
    setLoginDisabled(true);
    try {
      const methods = await pb.collection("members").listAuthMethods();
      const provider = methods.oauth2.providers.find((p) => p.name === "discord");
      if (!provider) throw new Error("Discord provider not found");
      const redirectUrl = window.location.origin + window.location.pathname;
      localStorage.setItem("pb_oauth_provider", JSON.stringify(provider));
      window.location.href = provider.authUrl + encodeURIComponent(redirectUrl);
    } catch (err) {
      console.error("Login failed:", err);
      setLoginDisabled(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    pb.authStore.clear();
    refreshFromStore();
  }, [refreshFromStore]);

  const handleRecordUpdate = useCallback(
    (updated) => {
      pb.authStore.save(pb.authStore.token, updated);
      refreshFromStore();
    },
    [refreshFromStore],
  );

  let oauthStatusStyle = { fontSize: "0.9rem" };
  if (oauthStatus.variant === "success") {
    oauthStatusStyle = {
      color: "green",
      background: "#dfd",
      border: "1px solid #080",
      borderRadius: "4px",
      padding: "0.5rem",
    };
  } else if (oauthStatus.variant === "error") {
    oauthStatusStyle = {
      color: "red",
      background: "#fdd",
      border: "1px solid #c00",
      borderRadius: "4px",
      padding: "0.5rem",
      fontFamily: "monospace",
      fontSize: "0.8rem",
      whiteSpace: "pre-wrap",
      wordBreak: "break-all",
    };
  } else if (oauthStatus.variant === "error-plain") {
    oauthStatusStyle = { fontSize: "0.9rem", color: "red" };
  }

  return (
    <>
      <h1>174th Battle Group: Manager</h1>

      {!loggedIn && (
        <section id="anonymous">
          <p>You are not logged in. Please log in to access this site:</p>
          <button id="login" onClick={handleLogin} disabled={loginDisabled}>
            Login with Discord
          </button>
        </section>
      )}

      {oauthStatus.text && (
        <p id="oauth-status" style={oauthStatusStyle}>
          {oauthStatus.text}
        </p>
      )}

      {loggedIn && (
        <section
          id="authed"
          style={{ display: "flex", flexDirection: "column", gap: "1em" }}
        >
          <Welcome record={record} />
          <RequiredInfo record={record} />
          <RolePreferences record={record} onUpdate={handleRecordUpdate} />
          <OnCallSchedule record={record} onUpdate={handleRecordUpdate} />
          <Ledger />
          <div>
            <button id="logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </section>
      )}
    </>
  );
}
