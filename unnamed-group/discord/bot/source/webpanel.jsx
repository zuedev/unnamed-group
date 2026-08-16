import render from "preact-render-to-string";

const serverOptions = {
  port: 4242,
  hostname: "0.0.0.0",
  automaticCompression: true,
};

const COOKIE_NAME = "webpanel_session";

const hash = async (text) => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const LoginPage = ({ error }) => (
  <html>
    <head>
      <title>Webpanel Login</title>
    </head>
    <body>
      <form method="POST" action="/login">
        <label>
          Password <input type="password" name="password" autofocus />
        </label>
        <button type="submit">Log in</button>
        {error && <p>Incorrect password.</p>}
      </form>
    </body>
  </html>
);

const html = (node, status = 200) =>
  new Response(`<!DOCTYPE html>${render(node)}`, {
    status,
    headers: { "Content-Type": "text/html" },
  });

const getSessionCookie = (request) =>
  request.headers
    .get("Cookie")
    ?.split("; ")
    .find((cookie) => cookie.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);

const isAuthenticated = async (request) =>
  getSessionCookie(request) === (await hash(process.env.WEBPANEL_PASSWORD));

const serverHandler = async (request) => {
  const url = new URL(request.url);

  if (url.pathname === "/login" && request.method === "POST") {
    const form = await request.formData();

    if (form.get("password") !== process.env.WEBPANEL_PASSWORD) {
      return html(<LoginPage error />, 401);
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
        "Set-Cookie": `${COOKIE_NAME}=${await hash(
          process.env.WEBPANEL_PASSWORD,
        )}; HttpOnly; Path=/; SameSite=Strict`,
      },
    });
  }

  if (!(await isAuthenticated(request))) return html(<LoginPage />);

  return new Response("OK", { status: 200 });
};

export default () => Deno.serve(serverOptions, serverHandler);
