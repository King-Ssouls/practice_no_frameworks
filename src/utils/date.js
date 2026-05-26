function pad(value) {
    return String(value).padStart(2, "0")
}

function formatDateTimeFromParts(year, month, day, hours, minutes) {
    return `${pad(day)}.${pad(month)}.${year} ${pad(hours)}:${pad(minutes)}`
}

function formatDateTime(value) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return formatDateTimeFromParts(
            value.getFullYear(),
            value.getMonth() + 1,
            value.getDate(),
            value.getHours(),
            value.getMinutes()
        )
    }

    const stringValue = String(value ?? "").trim()
    const match = stringValue.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/)

    if (match) {
        const [, year, month, day, hours, minutes] = match;
        return `${day}.${month}.${year} ${hours}:${minutes}`
    }

    const parsedDate = new Date(stringValue)

    if (!Number.isNaN(parsedDate.getTime())) {
        return formatDateTimeFromParts(
            parsedDate.getFullYear(),
            parsedDate.getMonth() + 1,
            parsedDate.getDate(),
            parsedDate.getHours(),
            parsedDate.getMinutes()
        )
    }

    return stringValue || "-"
}

module.exports = {
    formatDateTime
}
