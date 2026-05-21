const http = require("http");
const fs = require("fs");
const path = require("path");

const authRoutes = require("./routes/auth.routes");

function serveStatic(req, res) {
    if (req.url === "/style.css") {
        const cssPath = path.join(__dirname, "../public/style.css");
        const css = fs.readFileSync(cssPath);

        res.writeHead(200, {
            "Content-Type": "text/css; charset=utf-8"
        });

        res.end(css);
        return true;
    }

    return false;
}

const server = http.createServer(async (req, res) => {
    try {
        if (serveStatic(req, res)) {
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