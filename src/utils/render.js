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

module.exports = {
    render,
    sendHtml
};