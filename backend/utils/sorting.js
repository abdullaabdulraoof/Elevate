module.exports = (sort, allowedSortFields = []) => {
    // Default sorting
    let sortField = "-createdAt";

    if (!sort) {
        return { sortField };
    }

    const isDescending = sort.startsWith("-");
    const field = sort.replace("-", "");

    if (allowedSortFields.includes(field)) {
        sortField = isDescending ? `-${field}` : field;
    }

    return { sortField };
};