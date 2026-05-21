const { createUser, findUserByLogin } = require("../models/user.model");
const { hashPassword } = require("../utils/auth");
const { render, sendHtml } = require("../utils/render");
const parseBody = require("../utils/parseBody");

function sendRegisterMessage(res, message) {
    const html = render("register.html", { message });
    return sendHtml(res, html);
}

function showRegister(req, res) {
    const html = render("register.html");
    sendHtml(res, html);
}

async function register(req, res) {
    const body = await parseBody(req);

    const login = body.login;
    const password = body.password;
    const last_name = body.last_name;
    const first_name = body.first_name;
    const middle_name = body.middle_name;
    const phone = body.phone;
    const email = body.email;

    if (!login || !password || !last_name || !first_name || !phone || !email) {
        return sendRegisterMessage(
            res,
            `<p style="color:red;">Заполните все обязательные поля</p>`
        );
    }

    try {
        const existingUser = await findUserByLogin(login);

        if (existingUser) {
            return sendRegisterMessage(
                res,
                `<p style="color:red;">Ошибка регистрации. Такой логин уже существует</p>`
            );
        }

        const passwordHash = hashPassword(password);

        await createUser({
            login: login,
            password_hash: passwordHash,
            last_name: last_name,
            first_name: first_name,
            middle_name: middle_name,
            phone: phone,
            email: email
        });

        return sendRegisterMessage(
            res,
            `<p style="color:green;">Пользователь зарегистрирован</p>`
        );
    } catch (error) {
        console.log(error);

        if (error.code === "23505") {
            return sendRegisterMessage(
                res,
                `<p style="color:red;">Ошибка регистрации. Такой логин уже существует</p>`
            );
        }

        return sendRegisterMessage(
            res,
            `<p style="color:red;">Ошибка регистрации. Проверьте подключение к базе данных и попробуйте снова</p>`
        );
    }
}

module.exports = {
    showRegister,
    register
};
