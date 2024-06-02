const router = require("express").Router();

const DocumentEdo = require("../models/DocumentEdo");

router.post("/create", async (req, res) => {
  const newDocumentEdo = new DocumentEdo(req.body);

  try {
    const savedDocumentEdo = await newDocumentEdo.save();
    //name: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    // folder: {type: String },
    // subFolder: {type: String },
    // docType: {type: String },
    // docTemplate: [{
    //   folder: {type: String},
    //   subfolder: {type: String},
    //   docType: {type: String},
    //   name: {type: String},
    //   mappings: {
    //     type: Object,
    //   }
    // }],
    res.status(200).json(savedDocumentEdo);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const documentEdos = await DocumentEdo.find();
    res.status(200).json(documentEdos);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const documentEdo = await DocumentEdo.findById(req.params.id);
    if (!documentEdo) {
      res.status(404).json("Document not found");
    }

    res.status(200).json(documentEdo);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const documentEdo = await DocumentEdo.findById(req.params.id);
    if (!documentEdo) {
      res.status(404).json("Document not found");
    }

    await documentEdo.delete();
    res.status(200).json("Document deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
