const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const DocumentEdoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    folder: {type: String },
    subFolder: {type: String },
    docType: {type: String },
    docTemplate: [{
      folder: {type: String},
      subfolder: {type: String},
      docType: {type: String},
      name: {type: String},
      mappings: {
        type: Object,
      }
    }],
    
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

module.exports = model("DocumentEdo", DocumentEdoSchema);
