import { auth } from "@/auth";
import { headers } from "next/headers";

export default async function DiscordData() {
  const session = await auth.api.getSession({ headers: await headers() });
  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });
  const discordAccount = accounts?.find((a) => a.provider === "discord");

  return (
    <main>
      <h1>Discord Data</h1>
      <p>The following data is stored about your Discord account:</p>
      <pre>
        {JSON.stringify(
          { user: session?.user, account: discordAccount },
          null,
          2,
        )}
      </pre>
    </main>
  );
}
