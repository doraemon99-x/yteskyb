// index.js
import express from 'express';
import fetch from 'node-fetch';

const app = express();

app.get('/live/:id', async (req, res) => {
  const videoID = req.params.id.split('.')[0];
  if (!videoID) return res.status(400).send("Video ID not found");

  const url = `https://www.youtube.com/live/${videoID}/live`;

  try {
    const response = await fetch(url);

    if (!response.ok)
      return res.status(500).send(`YouTube URL failed with status: ${response.status}`);

    const text = await response.text();
    const match = text.match(/(?<=hlsManifestUrl":").*\.m3u8/g);

    if (!match || match.length === 0)
      return res.status(404).send("M3U8 stream not found");

    res.redirect(302, match[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.use((req, res) => {
  res.status(404).send("Path not found");
});

const PORT = process.env.PORT || 7860;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
