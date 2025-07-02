import express from 'express';
import fetch from 'node-fetch';

const app = express();

app.get('/live/:id', async (req, res) => {
  const videoID = req.params.id.split('.')[0];
  const url = `https://www.youtube.com/live/${videoID}/live`;

  try {
    const response = await fetch(url, {
      headers: {
        'Cookie': 'VISITOR_INFO1_LIVE=w3nOTln2uxs; SID=g.a000yAjGRR-XXfQR-...; HSID=Ae8oYIuG1v-IzWQbR; SSID=AT7D0mEwg9c6jukkO; APISID=...; SAPISID=...; __Secure-3PSID=...',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(500).send(`YouTube responded with status: ${response.status}`);
    }

    const text = await response.text();
    const match = text.match(/(?<=hlsManifestUrl":").*?\.m3u8/g);

    if (match && match[0]) {
      return res.redirect(302, match[0]);
    } else {
      return res.status(404).send("No m3u8 URL found in YouTube page.");
    }
  } catch (err) {
    return res.status(500).send(`Error: ${err.message}`);
  }
});

app.use((req, res) => {
  res.status(404).send("Not found");
});

const PORT = process.env.PORT || 7860;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
