const { _ } = require("lodash");
const { google } = require("googleapis");
const { stream } = require("stream");

const client_email = "davdauit@gmail.com";
const private_key = "AIzaSyCKcHO2NpVWyVglN674ZFOE1fTWaqG5qQY";

const scopes = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.JWT(client_email, null, private_key, scopes);
const drive = google.drive({ version: "v3", auth });

const WORD_DOC_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const EXCEL_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

module.exports = {
  googleDocLinkForFile: async (
    { Body: fileBuffer, Metadata: { filename } },
    account
  ) => {
    const folderId = await getAccountFolderId(account);
    const { id, webViewLink } = await uploadGoogleFile(
      folderId,
      fileBuffer,
      filename
    );

    return {
      url: webViewLink + "&embedded=true",
      fileId: id,
    };
  },

  bufferForGFile: async (gFileId, mimeType) => {
    const fileBuffer = await downloadFile(gFileId, mimeType);
    return fileBuffer;
  },
};

async function getFolderId(name) {
  const { data } = await drive.files.list({
    q: `mimeType = 'application/vnd.google-apps.folder' and name = '${name}'`,
  });
  if (_.size(data.files) === 0) {
    throw new Error(`Folder not found: ${name}`);
  }
  return _.get(data, ["files", 0, "id"], null);
}

async function getAccountFolderId(account) {
  return getFolderId(`${folderPrefix}_account_${account}`);
}

async function createFolder(name) {
  const fileMetadata = {
    name: name,
    mimeType: "application/vnd.google-apps.folder",
  };
  const folder = await drive.files.create({
    resource: fileMetadata,
    fields: "id",
  });
  return folder.data.id;
}

async function uploadFile(name, folderId) {
  const fileMetadata = {
    name: name,
    parents: [folderId],
  };
  const media = {
    mimeType: "image/jpeg",
    body: fs.createReadStream,
  };
  const res = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id",
  });
  return res.data.id;
}

async function uploadGoogleFile(folderId, fileBuffer, fileName) {
  const fileMetadata = {
    name: fileName,
    mimeType: isDoc({ name: fileName })
      ? "application/vnd.google-apps.document"
      : "application/vnd.google-apps.spreadsheet",
    parents: [folderId],
  };

  // Initiate the source
  const bufferStream = new stream.PassThrough();
  // Write your buffer
  bufferStream.end(fileBuffer);

  const mimeType = WORD_DOC_MIME_TYPE;

  const media = {
    mimeType,
    body: bufferStream,
  };
  const file = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: "webViewLink, id, webContentLink",
  });

  await drive.permissions.create({
    fileId: file.data.id,
    requestBody: {
      role: "writer",
      type: "anyone",
    },
  });
  return file.data;
}

async function downloadFile(gFileId, mimeType) {
  const res = await drive.files.export(
    {
      fileId: gFileId,
      alt: "media",
      mimeType,
    },
    { responseType: "stream" }
  );

  return new Promise((resolve, reject) => {
    const chunks = [];
    res.data
      .on("end", () => {
        // create the final data Buffer from data chunks;
        const fileBuffer = Buffer.concat(chunks);
        resolve(fileBuffer);
      })
      .on("error", (err) => {
        reject(err);
      })
      .on("data", (chunk) => {
        chunks.push(chunk); // push data chunk to array
      });
  });
}
