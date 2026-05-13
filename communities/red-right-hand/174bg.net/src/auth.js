import { betterAuth } from "better-auth";
import { Pool } from "pg";

const postgresUser = process.env.POSTGRES_USER || "postgres";
const postgresPassword = process.env.POSTGRES_PASSWORD || "postgres";
const postgresHost = process.env.POSTGRES_HOST || "postgres";
const postgresPort = process.env.POSTGRES_PORT || 5432;
const postgresDatabase = process.env.POSTGRES_DB || "postgres";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: new Pool({
    connectionString: `postgresql://${postgresUser}:${postgresPassword}@${postgresHost}:${postgresPort}/${postgresDatabase}`,
  }),
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    },
  },
});
