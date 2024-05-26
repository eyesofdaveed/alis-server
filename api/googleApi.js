const { _ } = require("lodash");
const { google } = require("googleapis");

// Configuration
const clientId =
  "1013385759352-ve0pfgmc63s0fu1js81adbv46246i6ja.apps.googleusercontent.com";
const clientSecret = "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";
const redirectUri = "https://localhost:8800/auth/google/callback";
const scopes = ["https://www.googleapis.com/auth/drive"];
const oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

const WORD_DOC_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const EXCEL_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

module.exports = {
  getAuthUrl: async () => {
    return oAuth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: "offline",
      /** Pass in the scopes array defined above.
       * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
      scope: scopes,
      // Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes: true,
    });
  },
};
