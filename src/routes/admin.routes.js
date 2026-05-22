const adminController = require("../controllers/admin.controller");

async function adminRoutes(req, res) {
    const url = new URL(req.url, "http://localhost");

    if (req.method === "GET" && url.pathname === "/admin") {
        return adminController.showAdmin(req, res);
    }

    if (req.method === "POST" && url.pathname === "/admin/status") {
        return adminController.updateStatus(req, res);
    }

    return false;
}

module.exports = adminRoutes;