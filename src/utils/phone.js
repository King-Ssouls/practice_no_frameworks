function isValidPhone(phone) {
    return /^\d{11}$/.test(String(phone ?? ""))
}

module.exports = {
    isValidPhone
}