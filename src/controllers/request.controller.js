const parseBody = require("../utils/parseBody");
const { parseCookies } = require("../utils/cookies");
const { render, sendHtml, redirect, escapeHtml } = require("../utils/render");
const { createRequest, getRequestsByUserId } = require("../models/request.model");
const { formatDateTime } = require("../utils/date");
const { isValidPhone } = require("../utils/phone");

function isUser(req) {
    const cookies = parseCookies(req);
    return Boolean(cookies.user_id);
}

function getTodayDateTimeMin() {
    const today = new Date();
    const year = String(today.getFullYear());
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}T00:00`;
}

function isValidDesiredDateTime(value) {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(String(value ?? ""))) {
        return false;
    }

    const selectedDate = new Date(value);

    if (Number.isNaN(selectedDate.getTime())) {
        return false;
    }

    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate >= today;
}

function renderRequestForm(message = "") {
    return render("request.html", {
        message,
        min_desired_datetime: getTodayDateTimeMin()
    });
}

function showHome(req, res) {
    const html = render("home.html");
    sendHtml(res, html);
}

function showRequestForm(req, res) {
    if (!isUser(req)) {
        return redirect(res, "/login");
    }

    const html = renderRequestForm();
    sendHtml(res, html);
}

async function createNewRequest(req, res) {
    if (!isUser(req)) {
        return redirect(res, "/login");
    }

    const cookies = parseCookies(req);
    const body = await parseBody(req);

    if (
        !body.address ||
        !body.contact_phone ||
        !body.contact_email ||
        !body.service_type ||
        !body.desired_datetime ||
        !body.payment_type
    ) {
        const html = renderRequestForm(`<div class="error">Все поля обязательны для заполнения</div>`);
        return sendHtml(res, html);
    }

    if (!isValidPhone(body.contact_phone)) {
        const html = renderRequestForm(`<div class="error">Телефон должен содержать только 11 цифр</div>`);
        return sendHtml(res, html);
    }

    if (!isValidDesiredDateTime(body.desired_datetime)) {
        const html = renderRequestForm(`<div class="error">Нельзя выбрать дату раньше сегодняшнего дня</div>`);
        return sendHtml(res, html);
    }

    await createRequest({
        user_id: cookies.user_id,
        address: body.address,
        contact_phone: body.contact_phone,
        contact_email: body.contact_email,
        service_type: body.service_type,
        desired_datetime: body.desired_datetime,
        payment_type: body.payment_type
    });

    redirect(res, "/dashboard");
}

async function dashboard(req, res) {
    if (!isUser(req)) {
        return redirect(res, "/login");
    }

    const cookies = parseCookies(req);
    const requests = await getRequestsByUserId(cookies.user_id);
    let rows = "";

    if (requests.length === 0) {
        rows = `
          <tr>
            <td colspan="6">У вас пока нет заявок</td>
          </tr>
        `;
    } else {
        rows = requests.map((item) => {
            return `
            <tr>
                <td>${escapeHtml(item.service_type)}</td>
                <td>${escapeHtml(item.address)}</td>
                <td>${escapeHtml(formatDateTime(item.desired_datetime))}</td>
                <td>${escapeHtml(item.payment_type)}</td>
                <td class="status">${escapeHtml(item.status)}</td>
                <td>${escapeHtml(item.cancel_reason || "-")}</td>
            </tr>
          `;
        }).join("");
    }

    const html = render("dashboard.html", {
        requests: rows
    });

    sendHtml(res, html);
}

module.exports = {
    showHome,
    showRequestForm,
    createNewRequest,
    dashboard
};
