// utils/searching.js
module.exports = (filter, search, fields = []) => {
    if (!search) return filter;

    filter.$or = fields.map(field => ({
        [field]: {
            $regex: search,
            $options: "i"
        }
    }));

    return filter;
};