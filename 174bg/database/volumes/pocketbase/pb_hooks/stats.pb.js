routerAdd("get", "/stats", (e) => {
    const stats = $http.send({
        url: "https://db.174bg.net/api/stats",
        headers: { "content-type": "application/json" }
    })

    return e.html(200, $template.loadFiles(
        `${__hooks}/views/_layout.html`,
        `${__hooks}/views/stats.html`,
    ).render({
        stats: stats.json,
    }))
})

routerAdd("get", "/api/stats", (e) => {
    const heartbeat = $http.send({
        url: "https://db.174bg.net/api/heartbeat",
        headers: { "content-type": "application/json" }
    })

    return e.json(200, {
        heartbeat: heartbeat.json,
    })
})