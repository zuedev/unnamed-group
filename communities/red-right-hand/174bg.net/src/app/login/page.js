"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

function LoginRedirect() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/secure";
  const [error, setError] = useState(null);

  const signIn = () => {
    authClient.signIn
      .social({
        provider: "discord",
        callbackURL: callbackUrl,
      })
      .then(({ error }) => {
        if (error) setError(error.message ?? "Sign-in failed");
      });
  };

  useEffect(() => {
    signIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={signIn}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <p>Redirecting to Discord...</p>
      <button onClick={signIn}>Click here if nothing happens</button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <LoginRedirect />
    </Suspense>
  );
}
