const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const DocumentEdoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    googleDriveFolderId: {
      type: String,
      required: true,
    },
    googleDriveFileId: {
      type: String,
      required: true,
    },
    googleDriveFileUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("DocumentEdo", DocumentEdoSchema);
