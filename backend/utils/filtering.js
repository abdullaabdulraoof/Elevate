module.exports = (query, allowedFilters = []) => {
    const filter = {};

    allowedFilters.forEach((field) => {
        if (
            query[field] !== undefined &&
            query[field] !== null &&
            query[field] !== ""
        ) {
            filter[field] = query[field];
        }
    });

    return filter;
};