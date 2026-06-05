# express.unnamed.group

REST API for querying game server status using [GameDig](https://github.com/gamedig/node-gamedig). Built with Express 5.

## Endpoints

| Method | Path           | Description                               |
| ------ | -------------- | ----------------------------------------- |
| GET    | `/`            | Redirects to `/api`                       |
| GET    | `/api`         | Health check                              |
| GET    | `/api/servers` | Returns live status of configured servers |

## Environment Variables

| Variable    | Default | Description                   |
| ----------- | ------- | ----------------------------- |
| `HTTP_PORT` | `80`    | Port the HTTP server binds to |
| `UDP_PORT`  | —       | UDP port for GameDig queries  |

## Running Locally

```sh
npm install
npm start
```

## Docker

```sh
docker build -t express.unnamed.group .
docker run -p 80:80 -p 13337:13337/udp express.unnamed.group
```
