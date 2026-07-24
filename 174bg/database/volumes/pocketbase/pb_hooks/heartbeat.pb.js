routerAdd("GET", "/api/heartbeat", (e) => {
    try {
        const result = new DynamicModel({
            "value": nullString(),
        })

        let dateNow = Date.now();

        try {
            $app.db()
                .newQuery(`SELECT value FROM key_value_store WHERE key = "heartbeat"`)
                .one(result);
        } catch (error) {
            return e.json(404, { "error": "Heartbeat not found" });
        }

        let heartbeatValue = parseInt(result.value);
        let timeDifference = dateNow - heartbeatValue;
        let withinThreshold = timeDifference <= 60000; // 60 seconds threshold

        return e.json(200, { "timeDifference": timeDifference, "withinThreshold": withinThreshold });
    } catch (error) {
        return e.json(500, { "error": "Internal Server Error", "details": error.message });
    }
});

cronAdd("heartbeat", "* * * * *", () => {
    $app.db().newQuery(`UPDATE key_value_store SET value = ${Date.now()} WHERE key = "heartbeat"`).execute()
})