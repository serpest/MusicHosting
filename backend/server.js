const express = require('express');
const cors = require('cors');
const { argv } = require('process');

const songsRouter = require('./songs-router');
const usersRouter = require('./users-router');
const playlistsRouter = require('./playlists-router');

const app = express();

const DEFAULT_PORT = 3000;
const portArg = argv.find(arg => arg.startsWith('--port='));
const PORT = portArg ? parseInt(portArg.split('=')[1], 10) : DEFAULT_PORT;

app.listen(PORT, () => {
    console.log(`[INFO] Server is running on http://localhost:${PORT}`);
});

app.use(cors());
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Middleware used for logging requests
app.use((req, _res, next) => {
  console.log(`[INFO] Request: ${req.url}, ${req.method}`);
  next();
});

app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

app.get('/', (_req, res) => {
    res.status(200).json({ message: 'Welcome' });
});

app.use('/songs', songsRouter);
app.use('/users', usersRouter);
app.use('/playlists', playlistsRouter);
