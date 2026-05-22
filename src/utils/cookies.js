function parseCookies(req) {
    const header = req.headers.cookie || "";
    const cookies = {};

    header.split(";").forEach((item) => {
        const parts = item.split("=");

        if (parts.length === 2) {
            const key = parts[0].trim();
            const value = decodeURIComponent(parts[1].trim());

            cookies[key] = value;
        }
    });

    return cookies;
}

function setCookie(res, name, value) {
    res.setHeader(
        "Set-Cookie",
        `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly`
    );
}

function clearCookie(res, name) {
    res.setHeader(
        "Set-Cookie",
        `${name}=; Path=/; HttpOnly; Max-Age=0`
    );
}

module.exports = {
    parseCookies,
    setCookie,
    clearCookie
};