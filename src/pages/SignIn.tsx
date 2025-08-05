import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

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
    console.log("[FlexOAuth] accountId from query:", id);
  }, [location.search]);

  useEffect(() => {
    console.log("[FlexOAuth] error state changed:", error);
  }, [error]);

  useEffect(() => {
    console.log("[FlexOAuth] loading state changed:", loading);
  }, [loading]);

  useEffect(() => {
    console.log("[FlexOAuth] token state changed:", token);
  }, [token]);

  useEffect(() => {
    console.log("[FlexOAuth] showOpenButton state changed:", showOpenButton);
  }, [showOpenButton]);

  const handleSignIn = async () => {
    console.log("[FlexOAuth] handleSignIn called");
    setLoading(true);
    try {
      console.log("[FlexOAuth] Initiating Firebase signInWithPopup");
      const result = await signInWithPopup(auth, provider);
      console.log("[FlexOAuth] Firebase signInWithPopup successful", {
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        email: result.user.email,
      });
      const idToken = await result.user.getIdToken();
      console.log("[FlexOAuth] Token generated", idToken);
      setToken(idToken);
      setShowOpenButton(true);
    } catch (err: any) {
      console.error("[FlexOAuth] Sign-in error:", err);
      if ((err as any).code === "auth/popup-closed-by-user") {
        setError("Login canceled by user.");
      } else {
        setError(err.message || "Unknown error");
      }
    } finally {
      setLoading(false);
      console.log("[FlexOAuth] handleSignIn completed");
    }
  };

  const handleOpenApp = () => {
    console.log("[FlexOAuth] handleOpenApp called, token:", token);
    const url = `flexbrowser://auth?token=${encodeURIComponent(token)}${
      accountId ? `&accountId=${encodeURIComponent(accountId)}` : ""
    }`;
    console.log("[FlexOAuth] Opening Flex Browser via URL", url);
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
