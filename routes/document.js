const router = require("express").Router();

const Document = require("../models/Document");
const DocumentTemplate = require("../models/DocumentTemplate");
const { handleSingleUploadFile } = require("../utils/uploadSingleFile");

router.post("/create", async (req, res) => {
  let uploadedFile;

  try {
    uploadedFile = await handleSingleUploadFile(req, res);
  } catch (e) {
    return res.status(422).json({ errors: [e.message] });
  }

  const { file, body } = uploadedFile;
  const docType = body.docType || "documentTemplate";
  let fileToUpload;

  try {
    switch (docType) {
      case "document":
        fileToUpload = new Document({
          name: body.name,
          fileId: file.filename,
          folder: body.folder,
          subfolder: body.subfolder,
        });

        await fileToUpload.save();
      case "documentTemplate":
        fileToUpload = new DocumentTemplate({
          name: body.name,
          fileId: file.filename,
          docType: "documentTemplate",
        });

        await fileToUpload.save();
    }

    res.status(201).json(fileToUpload);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/document", async (req, res) => {
  try {
    const documents = await Document.find({
      folder: req.query.folder,
      subfolder: req.query.subfolder,
    });
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
