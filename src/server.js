const http = require("http");
const fs = require("fs");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const requestRoutes = require("./routes/request.routes");

function serveStatic(req, res) {
    const url = new URL(req.url, "http://localhost");

    if (url.pathname === "/style.css") {
        const cssPath = path.join(__dirname, "../public/style.css");

        sendFile(res, cssPath);
        return true;
    }

    if (url.pathname.startsWith("/media/")) {
        const mediaRoot = path.resolve(__dirname, "../public/media");
        const relativePath = url.pathname.replace("/media/", "");
        const filePath = path.resolve(mediaRoot, relativePath);

        if (!filePath.startsWith(mediaRoot) || !fs.existsSync(filePath)) {
            return false;
        }

        sendFile(res, filePath);
        return true;
    }

    return false;
}

const server = http.createServer(async (req, res) => {
    try {
        if (serveStatic(req, res)) {
            return;
        }

        const requestResult = await requestRoutes(req, res);

        if (requestResult !== false) {
            return;
        }

        const authResult = await authRoutes(req, res);

        if (authResult !== false) {
            return;
        }

        res.writeHead(404, {
            "Content-Type": "text/html; charset=utf-8"
        });

        res.end("<h1>Страница не найдена</h1>");
    } catch (error) {
        console.log(error);

        res.writeHead(500, {
            "Content-Type": "text/html; charset=utf-8"
        });

        res.end("<h1>Ошибка сервера</h1>");
    }
});

server.listen(3000, () => {
    console.log("Сервер запущен: http://localhost:3000");
});