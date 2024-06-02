const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const DocumentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    // googleDriveFolderId: {
    //   type: String,
    //   required: true,
    // },
    // googleDriveFileId: {
    //   type: String,
    //   required: true,
    // },
    // googleDriveFileUrl: {
    //   type: String,
    //   required: true,
    // },
    edos: [{folder: {type: String}, 
      subFolder: {type: String},
      name: { type: String},
      docType: { type: String, default: "docTemplates"}
    }],
    folder: { type: String},
    subFolder: { type: String},
  },
  { timestamps: true }
);

module.exports = model("Document", DocumentSchema);
