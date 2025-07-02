import express from 'express';
import { exec } from 'child_process';

const app = express();

app.get('/live/:id', (req, res) => {
  const videoID = req.params.id.split('.')[0];
  const url = `https://www.youtube.com/watch?v=${videoID}`;

  exec(`yt-dlp --cookies /app/cookies.txt -g "${url}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr || error.message);
      return res.status(500).send(stderr || error.message);
    }

    const lines = stdout.trim().split('\n');
    if (lines.length === 0) return res.status(404).send("No stream found");

    const redirectUrl = lines[1] || lines[0]; // Prefer video stream
    res.redirect(302, redirectUrl);
  });
});

app.use((req, res) => {
  res.status(404).send("Path not found");
});

const PORT = process.env.PORT || 7860;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
