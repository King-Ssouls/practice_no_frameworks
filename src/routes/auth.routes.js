const authController = require("../controllers/auth.controller");

async function authRoutes(req, res) {
    if (req.method === "GET" && req.url === "/register") {
        return authController.showRegister(req, res);
    }

    if (req.method === "GET" && req.url === "/login") {
        return authController.showLogin(req, res);
    }

    if (req.method === "GET" && req.url === "/logout") {
        return authController.logout(req, res);
    }

    if (req.method === "POST" && req.url === "/register") {
        return authController.register(req, res);
    }

    if (req.method === "POST" && req.url === "/login") {
        return authController.login(req, res);
    }

    return false;
}

module.exports = authRoutes;