const router = require("express").Router();

const User = require("../models/User");
const GoogleApi = require("../api/googleApi");

router.get("/google/login", async (req, res) => {
  try {
    const authUrl = await GoogleApi.getAuthUrl();
    res.status(200).json(authUrl);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Handle the callback from the authentication flow
router.get("/google/callback", async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange the authorization code for access and refresh tokens
    const { tokens } = await oAuth2Client.getToken(code);
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
      access_token: accessToken,
    });

    // Save the tokens in a database or session for future use

    // Redirect the user to a success page or perform other actions
    res.send("Authentication successful!");
  } catch (error) {
    console.error("Error authenticating:", error);
    res.status(500).send("Authentication failed.");
  }
});

module.exports = router;
