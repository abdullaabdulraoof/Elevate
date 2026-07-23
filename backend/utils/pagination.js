module.exports = (page = 1, limit = 10) => {
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1) page = 1;

    if (isNaN(limit) || limit < 1) limit = 10;

    // Prevent very large requests
    if (limit > 100) limit = 100;

    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip
    };
};