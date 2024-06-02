const router = require("express").Router();

const Document = require("../models/Document");
const { handleSingleUploadFile } = require("../utils/uploadSingleFile");

router.post("/create", async (req, res) => {
  let uploadedFile;

  try {
    uploadedFile = await handleSingleUploadFile(req, res);
  } catch (e) {
    return res.status(422).json({ errors: [e.message] });
  }

  const { file, body } = uploadedFile;

  try {
    const document = new Document({
      name: body.name,
      file: file.filename,
    });

    await document.save();
    res.status(201).json(document);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const documents = await Document.find();
    res.status(200).json(documents);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      res.status(404).json("Document not found");
    }

    await document.delete();
    res.status(200).json("Document deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
