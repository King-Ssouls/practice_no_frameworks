const pool = require("../db");

async function createRequest(data) {
    const result = await pool.query(
        `
        INSERT INTO requests
        (
          user_id,
          address,
          contact_phone,
          contact_email,
          service_type,
          desired_datetime,
          payment_type
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [
          data.user_id,
          data.address,
          data.contact_phone,
          data.contact_email,
          data.service_type,
          data.desired_datetime,
          data.payment_type
        ]
    );

    return result.rows[0];
}

async function getRequestsByUserId(userId) {
    const result = await pool.query(
        `
        SELECT *
        FROM requests
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [userId]
    );

    return result.rows;
}

async function getAllRequests() {
    const result = await pool.query(
        `
        SELECT
          requests.*,
          users.last_name,
          users.first_name,
          users.middle_name,
          users.phone,
          users.email
        FROM requests
        JOIN users ON users.id = requests.user_id
        ORDER BY requests.created_at DESC
        `
    );

    return result.rows;
}

async function updateRequestStatus(id, status, cancelReason) {
    const result = await pool.query(
        `
        UPDATE requests
        SET status = $1,
            cancel_reason = $2
        WHERE id = $3
        RETURNING *
        `,
        [status, cancelReason || null, id]
    );

    return result.rows[0];
}

module.exports = {
    createRequest,
    getRequestsByUserId,
    getAllRequests,
    updateRequestStatus
};