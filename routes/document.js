const router = require("express").Router();

const Document = require("../models/Document");

router.post("/create", async (req, res) => {
  const newDocument = new Document(req.body);

  try {
    const savedDocument = await newDocument.save();
    res.status(200).json(savedDocument);
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
