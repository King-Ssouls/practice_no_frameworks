const { createUser, findUserByLogin } = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/auth");
const { setCookie, clearCookie } = require("../utils/cookies");
const { render, sendHtml, redirect } = require("../utils/render");
const parseBody = require("../utils/parseBody");
const { isValidPhone } = require("../utils/phone");

function sendRegisterMessage(res, message) {
    const html = render("register.html", { message });
    return sendHtml(res, html);
}

function sendLoginMessage(res, message) {
    const html = render("login.html", { message });
    return sendHtml(res, html);
}

function showRegister(req, res) {
    const html = render("register.html");
    sendHtml(res, html);
}

function showLogin(req, res) {
    const html = render("login.html");
    sendHtml(res, html);
}

function logout(req, res) {
    clearCookie(res, "user_id");
    clearCookie(res, "role");
    redirect(res, "/login");
}

async function register(req, res) {
    const body = await parseBody(req);

    const login = body.login;
    const password = body.password;
    const lastName = body.last_name;
    const firstName = body.first_name;
    const middleName = body.middle_name;
    const phone = body.phone;
    const email = body.email;

    if (!login || !password || !lastName || !firstName || !phone || !email) {
        return sendRegisterMessage(
            res,
            `<p class="message">Заполните все обязательные поля</p>`
        );
    }

    if (!isValidPhone(phone)) {
        return sendRegisterMessage(
            res,
            `<p class="message">Телефон должен содержать только 11 цифр</p>`
        );
    }

    try {
        const existingUser = await findUserByLogin(login);

        if (existingUser) {
            return sendRegisterMessage(
                res,
                `<p class="message">Ошибка регистрации. Такой логин уже существует</p>`
            );
        }

        const passwordHash = await hashPassword(password);

        await createUser({
            login,
            password_hash: passwordHash,
            last_name: lastName,
            first_name: firstName,
            middle_name: middleName || null,
            phone,
            email
        });

        return sendRegisterMessage(
            res,
            `<p class="message">Пользователь зарегистрирован. Теперь можно войти</p>`
        );
    } catch (error) {
        console.log(error);

        if (error.code === "23505") {
            return sendRegisterMessage(
                res,
                `<p class="message">Ошибка регистрации. Такой логин уже существует</p>`
            );
        }

        return sendRegisterMessage(
            res,
            `<p class="message">Произошла ошибка при регистрации</p>`
        );
    }
}

async function login(req, res) {
    const body = await parseBody(req);

    const loginValue = body.login;
    const password = body.password;

    if (!loginValue || !password) {
        return sendLoginMessage(
            res,
            `<p class="message">Введите логин и пароль</p>`
        );
    }

    if (loginValue === "adminka" && password === "password") {
        setCookie(res, "role", "admin", {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
            sameSite: "Lax"
        });

        clearCookie(res, "user_id");
        return redirect(res, "/admin");
    }

    try {
        const user = await findUserByLogin(loginValue);

        if (!user) {
            return sendLoginMessage(
                res,
                `<p class="message">Пользователь с таким логином не найден</p>`
            );
        }

        const isPasswordCorrect = await comparePassword(password, user.password_hash);

        if (!isPasswordCorrect) {
            return sendLoginMessage(
                res,
                `<p class="message">Неверный пароль</p>`
            );
        }

        const fullName = [user.last_name, user.first_name, user.middle_name]
            .filter(Boolean)
            .join(" ");

        setCookie(res, "user_id", user.id, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
            sameSite: "Lax"
        });

        setCookie(res, "role", "user", {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
            sameSite: "Lax"
        });

        const html = render("dashboard.html", {
            full_name: fullName || user.login,
            login: user.login,
            email: user.email,
            phone: user.phone
        });

        return sendHtml(res, html);
    } catch (error) {
        console.log(error);

        return sendLoginMessage(
            res,
            `<p class="message">Произошла ошибка при входе</p>`
        );
    }
}

module.exports = {
    showRegister,
    showLogin,
    logout,
    register,
    login
};
