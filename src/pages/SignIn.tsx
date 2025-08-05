import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { auth, provider } from "../firebase";
import { getRedirectResult, signInWithRedirect } from "firebase/auth";

function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string>("");
  const [showOpenButton, setShowOpenButton] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);

  // Đọc query string sớm khi component mount
  const location = useLocation();
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const id = query.get("accountId");
    setAccountId(id);
  }, [location.search]);

  useEffect(() => {}, [error]);

  useEffect(() => {}, [loading]);

  useEffect(() => {}, [token]);

  useEffect(() => {}, [showOpenButton]);

  // Handle Firebase redirect result for Electron OAuth window
  useEffect(() => {
    getRedirectResult(auth)
      .then((result: any) => {
        if (result?.user) {
          return result.user.getIdToken();
        }
        throw new Error("No redirect result");
      })
      .then((idToken: string) => {
        setToken(idToken);
        setShowOpenButton(true);
      })
      .catch((err: any) => {
        console.error("[FlexOAuth] Redirect error:", err);
        setError(err.message || "Redirect sign-in failed");
      });
  }, []);

  // Handle Firebase redirect result only when auth redirect is complete
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (!query.has("accountId")) return;
    getRedirectResult(auth)
      .then((result: any) => {
        if (result?.user) {
          return result.user.getIdToken();
        }
        throw new Error("No redirect result");
      })
      .then((idToken: string) => {
        setToken(idToken);
        setShowOpenButton(true);
      })
      .catch((err: any) => {
        console.error("[FlexOAuth] Redirect error:", err);
        setError(err.message || "Redirect sign-in failed");
      });
  }, [location.search]);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      // Detect Electron environment and use embedded OAuth if available
      if ((window as any).api?.auth?.loginGoogle && accountId) {
        const { idToken } = await (window as any).api.auth.loginGoogle(
          accountId
        );
        setToken(idToken);
        setShowOpenButton(true);
      } else {
        // Fallback: use redirect flow to avoid popup blocking
        await signInWithRedirect(auth, provider);
        // Token will be handled in the redirect result effect
      }
    } catch (err: any) {
      console.error("[FlexOAuth] Sign-in error:", err);
      if ((err as any).code === "auth/popup-closed-by-user") {
        setError("Login canceled by user.");
      } else {
        setError(err.message || "Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApp = () => {
    const url = `flexbrowser://auth?token=${encodeURIComponent(token)}${
      accountId ? `&accountId=${encodeURIComponent(accountId)}` : ""
    }`;
    window.open(url, "_self");
  };

  return (
    <div className="sign-in">
      <h1>Sign In</h1>
      <button onClick={handleSignIn} disabled={loading}>
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>
      {error && <p className="error">{error}</p>}
      {token && (
        <button
          onClick={handleOpenApp}
          disabled={!token}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#4285F4",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Open Flex Browser
        </button>
      )}
    </div>
  );
}

export default SignIn;
