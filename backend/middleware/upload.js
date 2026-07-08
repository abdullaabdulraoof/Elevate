const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination(req, file, cb) {

        if (req.baseUrl.includes("trainer")) {
            cb(null, "uploads/trainers");
        } else if (req.baseUrl.includes("member")) {
            cb(null, "uploads/members");
        } else {
            cb(null, "uploads/profile");
        }
    },

    filename(req, file, cb) {
        cb(
            null,
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname)
        );
    }
});

const fileFilter = (req, file, cb) => {

    const allowed = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp"
    ];

    if (allowed.includes(file.mimetype))
        cb(null, true);
    else
        cb(new Error("Only image files are allowed"), false);
};

module.exports = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});