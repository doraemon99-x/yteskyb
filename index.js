import express from 'express';
import { exec } from 'child_process';

const app = express();

app.get('/live/:id', (req, res) => {
  const videoID = req.params.id.split('.')[0];
  const url = `https://www.youtube.com/watch?v=${videoID}`;

  exec(`yt-dlp -g ${url}`, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr || error.message);

    const lines = stdout.trim().split('\n');
    if (lines.length === 0) return res.status(404).send("Stream not found");

    res.redirect(302, lines[1] || lines[0]); // Prioritaskan video stream
  });
});

const PORT = process.env.PORT || 7860;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
