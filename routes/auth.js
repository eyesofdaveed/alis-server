const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../models/User");
const GoogleApi = require("../api/googleApi");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

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

// Регистрация
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  // Проверка, существует ли пользователь с таким email или username
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Хеширование пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // Создание нового пользователя
  const newUser = new User({ username, email, password: hashedPassword, role });
  await newUser.save();

  res.status(201).json({ message: 'User registered successfully' });
});

// Вход
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Проверка, существует ли пользователь с таким email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Проверка пароля
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Создание JWT
  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

  res.status(200).json({ token: token });
});

// Проверка JWT
router.get('/protected', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId;
    res.status(200).json({ message: 'Protected route accessed', userId: req.userId, role: decoded.role });
  } catch (error) {
    console.log(error, 100);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;