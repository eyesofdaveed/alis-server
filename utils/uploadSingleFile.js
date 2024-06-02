const path = require("path");
const multer = require("multer");

const uploadFilePath = path.resolve(__dirname, "../..", "public/uploads");

const storageFile = multer.diskStorage({
  destination: uploadFilePath,
  filename: (req, file, fn) => {
    fn(
      null,
      `${new Date().getTime().toString()}-${file.fieldname}${path.extname(
        file.originalname
      )}`
    );
  },
});

const uploadFile = multer({
  storage: storageFile,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype !=
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return cb(new Error("Wrong file type"));
    }
    cb(null, true);
  },
}).single("file");

const handleSingleUploadFile = async (req, res) => {
  return new Promise((resolve, reject) => {
    uploadFile(req, res, (error) => {
      if (error) {
        reject(error);
      }

      resolve({ file: req.file, body: req.body });
    });
  });
};

module.exports = { handleSingleUploadFile };
