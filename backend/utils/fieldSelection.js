module.exports = (fields, allowedFields = []) => {

    if (!fields) return "";

    return fields
        .split(",")
        .filter(field => allowedFields.includes(field))
        .join(" ");

};