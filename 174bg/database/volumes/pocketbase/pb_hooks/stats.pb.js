routerAdd("get", "/stats", (e) => {
    const heartbeat = $http.send({
        url: "https://db.174bg.net/api/heartbeat",
        headers: { "content-type": "application/json" }
    })

    return e.html(200, $template.loadFiles(
        `${__hooks}/views/_layout.html`,
        `${__hooks}/views/stats.html`,
    ).render({
        "timeDifference": heartbeat.json.timeDifference,
        "withinThreshold": heartbeat.json.withinThreshold,
    }))
})