const requestController = require("../controllers/request.controller");


async function requestRoutes(req, res) {
    const url = new URL(req.url, "http://localhost");

    if (req.method === "GET" && url.pathname === "/") {
        return requestController.showHome(req, res);
    }

    if (req.method === "GET" && url.pathname === "/request") {
        return requestController.showRequestForm(req, res);
    }

    if (req.method === "POST" && url.pathname === "/request") {
        return requestController.createNewRequest(req, res);
    }

    if (req.method === "GET" && url.pathname === "/dashboard") {
        return requestController.dashboard(req, res);
    }
    return false;
}
module.exports = requestRoutes;