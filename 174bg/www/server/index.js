const configuration = {
    redirects: [
        { from: "/discord", to: "https://discord.gg/RGgSfVj4DD" },
        { from: "/handbook", to: "https://handbook.174bg.net" },
        { from: "/docs", to: "https://handbook.174bg.net" },
        { from: "/manager", to: "https://manager.174bg.net" },
        { from: "/login", to: "https://manager.174bg.net" },
        { from: "/database", to: "https://db.174bg.net" },
        { from: "/db", to: "https://db.174bg.net" },
    ],
};

export default {
    /**
     * Fetch event handler, this function will be called whenever a request is made to the worker. The function will parse the request and return a response based on the request path.
     *
     * @param {Request} request - the incoming request object
     * @param {Environment} environment - the environment object
     * @param {Context} context - the context object
     *
     * @returns {Response} a new Response object
     */
    async fetch(request, environment, context) {
        const url = new URL(request.url);

        if (configuration.redirects) {
            for (const redirect of configuration.redirects) {
                if (
                    url.pathname === redirect.from ||
                    url.pathname === redirect.from + "/"
                ) {
                    return Response.redirect(redirect.to, 301);
                }
            }
        }

        if (url.pathname.startsWith("/api")) {
            return new Response("Hello from the API!", {
                headers: { "Content-Type": "text/plain" },
            });
        }

        return environment.ASSETS.fetch(new Request(url, request));
    }
};