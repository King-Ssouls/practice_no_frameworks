const pool = require("../db");

async function findUserByLogin(login) {
    const result = await pool.query(
        `
        SELECT *
        FROM users
        WHERE login = $1
        LIMIT 1
        `,
        [login]
    );

    return result.rows[0] || null;
}

async function createUser(user) {
    const result = await pool.query(
        `
        INSERT INTO users
        (
            login,
            password_hash,
            last_name,
            first_name,
            middle_name,
            phone,
            email
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [
            user.login,
            user.password_hash,
            user.last_name,
            user.first_name,
            user.middle_name,
            user.phone,
            user.email
        ]
    );

    return result.rows[0];
}

module.exports = {
    findUserByLogin,
    createUser
};