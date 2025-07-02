import express from 'express';
import fetch from 'node-fetch';

const app = express();

// Paste cookie kamu dalam format 1 baris di sini:
const cookieHeader = `__Secure-3PSID=g.a000ygjGRdZJjnV0I_U3M7HdvzTWSuGzVostbS38wxugBJtcTJ2Dakc8vvtbA2bAWu3ir_eKfgACgYKAYUSARMSFQHGX2Mi3r4wCIxY2d3ILIe1rK14lBoVAUF8yKpZ_wsIae6cXNQOLnWV77P80076; __Secure-3PAPISID=bQn-hot-Kqr8sOJC/AYR4ffuq9Moehn3I-; GPS=1; YSC=SCXSPqAhGGo; VISITOR_INFO1_LIVE=nLkFPNd_Uu4; VISITOR_PRIVACY_METADATA=CgJVUxIEGgAgYQ%3D%3D; __Secure-ROLLOUT_TOKEN=CMPBl7HYl7iBwQEQt7_hpOuejgMYoquDpeuejgM%3D; PREF=tz; __Secure-1PSIDTS=sidts-CjEB5H03P7VaIigU3C4fWVgiHHQD74-j1AALCkZs96ksvQfR0zHlOSiz3Coc4uYG6DvDEAA; __Secure-3PSIDTS=sidts-CjEB5H03P7VaIigU3C4fWVgiHHQD74-j1AALCkZs96ksvQfR0zHlOSiz3Coc4uYG6DvDEAA; LOGIN_INFO=AFmmF2swRAIgYeEDPbHkrq3le_Uw4j6NPp0s6IJ9HqRlOwWaUDPAcR8CIG0Qq5d2r_PZkaAIwrvsKvUyD5svuBYh-GU9nnJsum0B:QUQ3MjNmeFlVMExGbng3VW5Kc0p1VGFXblVGVnlHMTlGMzFNbDZNd3BsZmp0THBHNzZVR0VVRWlOOWVPcms1N09mcHR4ZkRVVVZFSVNQM0NSZHlfcnE2Y0FabUxoSENjeTFpdU9pWGxvUXJ2eVhtTC0tQUNncjU0eVFDV1MxaV9MY1VfZEdJLTZobnp5MWN6Sk9USGRTWi1sbFdLM0xWTDhB; __Secure-3PSIDCC=AKEyXzVqA70DtAdUrhh3v72yVRcePTlPenNvaukALb_trYGEKuEE-iVoxEx5AqtVzt5vIMYj0Q;`;

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
