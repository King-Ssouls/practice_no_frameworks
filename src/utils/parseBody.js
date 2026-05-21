function parseBody(req) {
    return new Promise((resolve) => {
        let body = ""

        req.on("data", (chunk) => {
            body += chunk.toString()
        });

        req.on("end", () => {
            const params = new URLSearchParams(body)
            const result = {}

            for (const [key, value]  of params.entries()) {
                result[key] = value.trim()
            }

            resolve(result)
        })
    })
}

module.exports = parseBody