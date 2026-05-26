const parseBody = require("../utils/parseBody");
const { parseCookies } = require("../utils/cookies");
const { render, sendHtml, redirect, escapeHtml } = require("../utils/render");
const { getAllRequests, updateRequestStatus } = require("../models/request.model")

const inProgressStatus = "В работе"
const finalStatuses = ["Выполнено", "Отменено"]
const allowedStatuses = [inProgressStatus, ...finalStatuses]

function isAdmin(req) {
    const cookies = parseCookies(req)
    return cookies.role === "admin"
}

function isFinalStatus(status) {
    return finalStatuses.includes(status)
}

function renderStatusOption(value, currentStatus) {
    let selected = "";

    if (value === currentStatus) {
        selected = " selected";
    } else {
        selected = "";
    }
    const safeValue = escapeHtml(value)

    return `<option value="${safeValue}"${selected}>${safeValue}</option>`
}

function buildStatusOptions(currentStatus) {
    const statuses = allowedStatuses.includes(currentStatus)
        ? allowedStatuses : [currentStatus, ...allowedStatuses]

    return statuses.map((status) => renderStatusOption(status, currentStatus)).join("")
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
            <td colspan="10">Заявок пока нет</td>
          </tr>
        `;
    } else {
        rows = requests.map((item) => {
            const locked = isFinalStatus(item.status);
            const cancelReasonValue = item.status === "Отменено"
                ? escapeHtml(item.cancel_reason || "")
                : ""

            return `
                <tr>
                    <td>${escapeHtml(item.last_name)}</td>
                    <td>${escapeHtml(item.first_name)}</td>
                    <td>${escapeHtml(item.middle_name || "-")}</td>
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
                        <form class="actions-form${locked ? " is-locked" : ""}" method="POST" action="/admin/status">
                        <input type="hidden" name="id" value="${item.id}">

                        <select name="status" required${locked ? " disabled" : ""}>
                            ${buildStatusOptions(item.status)}
                        </select>

                        <textarea name="cancel_reason" placeholder="Причина отмены"${locked ? " disabled" : ""}>${cancelReasonValue}</textarea>

                        ${locked ? '<p class="actions-form-note">Финальный статус нельзя изменить</p>' : ""}

                        <button class="btn" type="submit"${locked ? " disabled" : ""}>Сохранить</button>
                        </form>
                    </td>
              </tr>
          `;
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

    if (!allowedStatuses.includes(body.status)) {
        return redirect(res, "/admin");
    }

    const cancelReason = body.status === "Отменено"
        ? body.cancel_reason?.trim()
        : null;

    if (body.status === "Отменено" && !cancelReason) {
        return redirect(res, "/admin");
    }

    await updateRequestStatus(
        body.id,
        body.status,
        cancelReason
    );

    redirect(res, "/admin");
}

module.exports = {
    showAdmin,
    updateStatus
};