import { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      window.location.href = `flexbrowser://auth?token=${token}`;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="sign-in">
      <h1>Sign In</h1>
      <button onClick={handleSignIn} disabled={loading}>
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default SignIn;
