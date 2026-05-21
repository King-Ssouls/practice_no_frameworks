const authController = require("../controllers/auth.controller");

async function authRoutes(req, res) {
    if (req.method === "GET" && req.url === "/register") {
        return authController.showRegister(req, res);
    }

    if (req.method === "POST" && req.url === "/register") {
        return authController.register(req, res);
    }

    return false;
}

module.exports = authRoutes;