const parseBody = require("../utils/parseBody");
const { parseCookies } = require("../utils/cookies");
const { render, sendHtml, redirect, escapeHtml } = require("../utils/render");
const { getAllRequests, updateRequestStatus } = require("../models/request.model");

function isAdmin(req) {
    const cookies = parseCookies(req);
    return cookies.role === "admin";
  }

async function showAdmin(req, res) {
    if (!isAdmin(req)) {
        return redirect(res, "/login");
    }

    const requests = await getAllRequests();

    let rows = "";

    if (requests.length === 0) {
        rows = `
          <tr>
            <td colspan="8">Заявок пока нет</td>
          </tr>
        `;
    } else {
        rows = requests.map((item) => {
          return 
          `
              <tr>
                  <td>${escapeHtml(item.full_name)}</td>
                    <td>
                      ${escapeHtml(item.phone)}<br>
                      ${escapeHtml(item.email)}
                    </td>
                    <td>${escapeHtml(item.service_type)}</td>
                    <td>${escapeHtml(item.address)}</td>
                    <td>${escapeHtml(item.desired_datetime)}</td>
                    <td>${escapeHtml(item.payment_type)}</td>
                    <td class="status">
                      ${escapeHtml(item.status)}
                      ${
                        item.cancel_reason
                          ? `<br><small>Причина: ${escapeHtml(item.cancel_reason)}</small>`
                          : ""
                      }
                    </td>
                    <td>
                      <form class="actions-form" method="POST" action="/admin/status">
                        <input type="hidden" name="id" value="${item.id}">

                        <select name="status" required>
                          <option value="В работе">В работе</option>
                          <option value="Выполнено">Выполнено</option>
                          <option value="Отменено">Отменено</option>
                        </select>

                        <textarea name="cancel_reason" placeholder="Причина отмены"></textarea>

                        <button class="btn" type="submit">Сохранить</button>
                      </form>
                  </td>
              </tr>
          `
      }).join("");
    }

    const html = render("admin.html", {
        requests: rows
    });

    sendHtml(res, html);
}

async function updateStatus(req, res) {
    if (!isAdmin(req)) {
        return redirect(res, "/login");
    }

    const body = await parseBody(req);

    if (!body.id || !body.status) {
        return redirect(res, "/admin");
    }

    if (body.status === "Отменено" && !body.cancel_reason) {
        return redirect(res, "/admin")
    }

    await updateRequestStatus(
      body.id,
      body.status,
      body.cancel_reason
    )

    redirect(res, "/admin")
}

module.exports = {
    showAdmin,
    updateStatus
}