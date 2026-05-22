const parseBody = require("../utils/parseBody");
const { parseCookies } = require("../utils/cookies");
const { render, sendHtml, redirect, escapeHtml } = require("../utils/render");
const { createRequest, getRequestsByUserId } = require("../models/request.model")

function isUser(req) {
    const cookies = parseCookies(req);
    return Boolean(cookies.user_id);
}

function showHome(req, res) {
    const html = render("home.html");
    sendHtml(res, html);
}

function showRequestForm(req, res) {
    if (!isUser(req)) {
        return redirect(res, "/login")
    }

    const html = render("request.html")
    sendHtml(res, html)
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
        const html = render("request.html", {
            message: `<div class="error">Все поля обязательны для заполнения</div>`
        });

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
              <td>${escapeHtml(item.desired_datetime)}</td>
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
