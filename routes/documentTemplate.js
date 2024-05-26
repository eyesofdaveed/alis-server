const router = require("express").Router();

const DocumentTemplate = require("../models/DocumentTemplate");

router.post("/create", async (req, res) => {
  const newDocumentTemplate = new DocumentTemplate(req.body);

  try {
    const savedDocumentTemplate = await newDocumentTemplate.save();
    res.status(200).json(savedDocumentTemplate);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const documentTemplates = await DocumentTemplate.find();
    res.status(200).json(documentTemplates);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const documentTemplate = await DocumentTemplate.findById(req.params.id);
    if (!documentTemplate) {
      res.status(404).json("Document template not found");
    }

    await documentTemplate.delete();
    res.status(200).json("Document template deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;