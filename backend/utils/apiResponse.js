module.exports.success = (
    res,
    statusCode,
    message,
    data = null,
    pagination = null
) => {

    const response = {
        success: true,
        message
    };

    if (data !== null) {
        response.data = data;
    }

    if (pagination) {
        response.pagination = pagination;
    }

    return res.status(statusCode).json(response);
};

module.exports.error = (
    res,
    statusCode,
    message,
    errors = null
) => {

    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};