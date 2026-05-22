const fs = require("fs");
const path = require("path");

function render(fileName, data = {}) {
    const filePath = path.join(__dirname, "../../views", fileName);

    let html = fs.readFileSync(filePath, "utf-8");

    for (const key in data) {
        html = html.replaceAll(`{{${key}}}`, data[key]);
    }

    html = html.replaceAll(/\{\{[a-zA-Z0-9_]+\}\}/g, "");

    return html;
}

function sendHtml(res, html) {
    res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8"
    });

    res.end(html);
}

function redirect(res, url) {
    res.writeHead(302, {
        Location: url
    });

    res.end();
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

module.exports = {
    render,
    sendHtml,
    redirect,
    escapeHtml
};