import express from 'express';
import fetch from 'node-fetch';

const app = express();

// Paste cookie kamu dalam format 1 baris di sini:
const cookieHeader = `GPS=1; YSC=lLLUlzHe_xo; VISITOR_INFO1_LIVE=r6Zremtrc6I; VISITOR_PRIVACY_METADATA=CgJJRBIEGgAgSA%3D%3D; SID=g.a000ygjGRboUaEJu6-DcfxjxVNCd9LrYxfZvhslIGD4r0jAhKvm9OfwjcNnWU11czn6t8CXLaQACgYKAb0SARMSFQHGX2MiAm1heoGh3Y5IAsqwYHMcvBoVAUF8yKrg7XBNgYyFBPyMFj0tpWEa0076; __Secure-1PSID=g.a000ygjGRboUaEJu6-DcfxjxVNCd9LrYxfZvhslIGD4r0jAhKvm9cYy37e854D0JcjQ1kLWbVwACgYKAeMSARMSFQHGX2MiRhOC3-IStj0GDiVaLPWXLRoVAUF8yKr_iR1IfGBU-cyuMq_FSqxa0076; __Secure-3PSID=g.a000ygjGRboUaEJu6-DcfxjxVNCd9LrYxfZvhslIGD4r0jAhKvm9Mv5KP9ydg1iEtknWWtm9BAACgYKAa8SARMSFQHGX2Minf6_UUwwc4JVDmGAmeOD-RoVAUF8yKqcEPtIOxf8w9fYT0mgpo_b0076; HSID=Ad0ltHJp5buF5o1WB; SSID=AwAhWuPrrFNoeKNo5; APISID=AICXC3mdpz8VYl6F/AGQX6RfahDRs7OJUS; SAPISID=BDSQTtoxYI5TrwoY/AwHJTlwbYckfCJaKS; __Secure-1PAPISID=BDSQTtoxYI5TrwoY/AwHJTlwbYckfCJaKS; __Secure-3PAPISID=BDSQTtoxYI5TrwoY/AwHJTlwbYckfCJaKS; __Secure-1PSIDTS=sidts-CjEB5H03P2YV13-nWqv8BDgOcR1kll1pHNP9XWqDPFsmpSTtwrAP7R3IZmS15qhLC5xCEAA; __Secure-3PSIDTS=sidts-CjEB5H03P2YV13-nWqv8BDgOcR1kll1pHNP9XWqDPFsmpSTtwrAP7R3IZmS15qhLC5xCEAA; LOGIN_INFO=AFmmF2swRQIhAIk21Z-oy6A1oYl-p3JalGbbb5LllzuGO38Y-btvxTEMAiBt8xoxtH5dc9Gmdpp5wUPj7EVURjxP1d5Vp0JEoWkv4w:QUQ3MjNmd1ZPc2MybjVLb2drb1g4bnhsOFBnZThXSS1heFVYcG5ibVhRMkFrbnVCZTVWWE9kaEhlTFhJdEcxVWNUMXdmY2FWZ3loUE02VXdZTTlLakhBT3RleE1aeERYXzZCaHNmX2Vhd0tqcXdKWUxiN3M3RWZ6M1RUckc2UEowTGwwTlp6djROeFJSd0hLdlFQU0FJTlBrTVJ4YXVqRWNB; __Secure-ROLLOUT_TOKEN=CPK0xu6O0YqvqwEQ-daovumejgMYka2HwOmejgM%3D; SIDCC=AKEyXzUm25RtdicZcW9uR6hndfUREXNKo0cY1DWpn3uOvcmj5v8c57AFULNk4pu3-nz_CtNS; __Secure-1PSIDCC=AKEyXzUR7A5-gpijPY6eILnIapMbNPBBX8rUN0vbACzGve031yaA45fhUiznMN44RIkU0ww; __Secure-3PSIDCC=AKEyXzX4p_R919zCdKIpFIG2zeqSKXA9Ep__314--E_fTrVpK94AuL6IyOViTjOmVPIWQaAHRA; PREF=tz;`;

app.get('/live/:id', async (req, res) => {
  const videoID = req.params.id.split('.')[0];
  const url = `https://www.youtube.com/live/${videoID}/live`;

  try {
    const response = await fetch(url, {
      headers: {
        'Cookie': cookieHeader,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(500).send(`YouTube responded with status: ${response.status}`);
    }

    const html = await response.text();
    const match = html.match(/(?<=hlsManifestUrl":")[^"]+\.m3u8/);

    if (match && match[0]) {
      return res.redirect(302, match[0]);
    } else {
      return res.status(404).send("No .m3u8 URL found in YouTube response.");
    }
  } catch (err) {
    return res.status(500).send(`Fetch error: ${err.message}`);
  }
});

// fallback
app.use((req, res) => {
  res.status(404).send('Endpoint not found');
});

const PORT = process.env.PORT || 7860;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
