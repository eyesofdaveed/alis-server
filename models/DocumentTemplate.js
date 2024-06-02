const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const DocumentTemplateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    docType: {type: String, required: true}
    
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
  },
  { timestamps: true }
);

module.exports = model("DocumentTemplate", DocumentTemplateSchema);
