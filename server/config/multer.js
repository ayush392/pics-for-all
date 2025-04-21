const multer = require("multer");
const path = require("path");

// Multer config

module.exports = multer({
    storage: multer.diskStorage({
        filename: function (req, file, cb) {
            // Set the file name to avoid collisions
            const uniqueSuffix = Date.now();
            const ext = path.extname(file.originalname);
            cb(null, (file.originalname || "image") + '-' + uniqueSuffix + ext);
          },        
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            cb(new Error("File type is not supported"), false);
            return;
        }
        cb(null, true);
    },
});