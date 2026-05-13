# 174gb.net

The official website of the 174th Battle Group, also known as the Red Right Hand.

## Development

The website is built using [Next.js](https://nextjs.org/) and is deployed via [Docker](https://www.docker.com/).

### First Run

After starting the containers, run the following command to apply database migrations:

```sh
docker compose exec 174bg-net npx auth@latest migrate --yes
```
