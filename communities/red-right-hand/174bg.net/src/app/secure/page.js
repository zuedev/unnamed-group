import { auth } from "@/auth";
import { headers } from "next/headers";

export default async function SecurePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <main>
      <h1>Secure Area</h1>
      <p>Welcome, {session?.user?.name ?? session?.user?.email}!</p>
    </main>
  );
}
