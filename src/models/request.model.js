const pool = require("../db");

const FINAL_STATUSES = ["Выполнено", "Отменено"];

async function findServiceIdByName(name) {
    const result = await pool.query(
        `
        SELECT id
        FROM services
        WHERE name = $1
        LIMIT 1
        `,
        [name]
    );

    return result.rows[0]?.id || null;
}

async function findPaymentMethodIdByName(name) {
    const result = await pool.query(
        `
        SELECT id
        FROM payment_methods
        WHERE name = $1
        LIMIT 1
        `,
        [name]
    );

    return result.rows[0]?.id || null;
}

async function createRequest(data) {
    const serviceId = await findServiceIdByName(data.service_type);
    const paymentMethodId = await findPaymentMethodIdByName(data.payment_type);

    if (!serviceId) {
        throw new Error("Service not found");
    }

    if (!paymentMethodId) {
        throw new Error("Payment method not found");
    }

    const result = await pool.query(
        `
        INSERT INTO applications
        (
          user_id,
          service_id,
          payment_method_id,
          address,
          contact_phone,
          contact_email,
          desired_datetime
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [
          data.user_id,
          serviceId,
          paymentMethodId,
          data.address,
          data.contact_phone,
          data.contact_email,
          data.desired_datetime
        ]
    );

    return result.rows[0];
}

async function getRequestsByUserId(userId) {
    const result = await pool.query(
        `
        SELECT
          applications.*,
          services.name AS service_type,
          payment_methods.name AS payment_type
        FROM applications
        JOIN services ON services.id = applications.service_id
        JOIN payment_methods ON payment_methods.id = applications.payment_method_id
        WHERE applications.user_id = $1
        ORDER BY applications.created_at DESC
        `,
        [userId]
    );

    return result.rows;
}

async function getAllRequests() {
    const result = await pool.query(
        `
        SELECT
          applications.*,
          services.name AS service_type,
          payment_methods.name AS payment_type,
          users.last_name,
          users.first_name,
          users.middle_name,
          users.phone,
          users.email
        FROM applications
        JOIN users ON users.id = applications.user_id
        JOIN services ON services.id = applications.service_id
        JOIN payment_methods ON payment_methods.id = applications.payment_method_id
        ORDER BY applications.created_at DESC
        `
    );

    return result.rows;
}

async function updateRequestStatus(id, status, cancelReason) {
    const result = await pool.query(
        `
        UPDATE applications
        SET status = $1,
            cancel_reason = $2
        WHERE id = $3
          AND status NOT IN ($4, $5)
        RETURNING *
        `,
        [status, cancelReason || null, id, ...FINAL_STATUSES]
    );

    return result.rows[0] || null;
}

module.exports = {
    createRequest,
    getRequestsByUserId,
    getAllRequests,
    updateRequestStatus
};
