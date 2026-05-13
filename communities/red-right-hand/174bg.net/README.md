# 174gb.net

The official website of the 174th Battle Group, also known as the Red Right Hand.

## Development

The website is built using [Next.js](https://nextjs.org/) and is deployed via [Docker](https://www.docker.com/).

### First Run

After starting the containers, apply the database migrations by piping each SQL file in `better-auth_migrations/` into the postgres container:

```sh
cat better-auth_migrations/*.sql | docker compose exec -T postgres psql -U postgres -d postgres
```

> If your `.env` uses a different `POSTGRES_USER` or `POSTGRES_DB`, substitute those values for `postgres` above.
