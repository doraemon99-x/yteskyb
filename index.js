import express from 'express';
import fetch from 'node-fetch';

const app = express();

// Paste cookie kamu dalam format 1 baris di sini:
const cookieHeader = `VISITOR_INFO1_LIVE=w3nOTln2uxs; VISITOR_PRIVACY_METADATA=CgJJRBIEGgAgbA%3D%3D; GPS=1; YSC=0wNgojGiqPs; __Secure-ROLLOUT_TOKEN=CKuQ3tC07d7YyAEQwt3Ood2ejgMY45urqN2ejgM%3D; PREF=tz; __Secure-1PSIDTS=sidts-CjEB5H03PwyV5IgOLJM9rO9gdNzB2GeCw98VIb-swno9sRf-fjdEMq8RQs7pbxw8VVniEAA; __Secure-3PSIDTS=sidts-CjEB5H03PwyV5IgOLJM9rO9gdNzB2GeCw98VIb-swno9sRf-fjdEMq8RQs7pbxw8VVniEAA; HSID=AlWnXcVFk0dibA-eL; SSID=AFWOG0Ij9_9juP0iN; APISID=lBTnjTG7H0O8q0Gp/AV1jr09BRfFtGy83y; SAPISID=ZAHQecZ_YJPnmmP7/ALpghqWQ130wjKj8N; __Secure-1PAPISID=ZAHQecZ_YJPnmmP7/ALpghqWQ130wjKj8N; __Secure-3PAPISID=ZAHQecZ_YJPnmmP7/ALpghqWQ130wjKj8N; SID=g.a000ygjGRZ3zEKx6r_v47HYiU6wdkepMvUJG62ahc3xd_WPPSP4CRl7HhIH6Cin7ullE2fbUdwACgYKAXgSARMSFQHGX2MiZILmeYDCluLg45CaZ-WLhxoVAUF8yKr7MV74i0xrCCNOpWcVo5mJ0076; __Secure-1PSID=g.a000ygjGRZ3zEKx6r_v47HYiU6wdkepMvUJG62ahc3xd_WPPSP4CD3ibw2X9cLbaiutNJv3LkAACgYKAXsSARMSFQHGX2MizTIpuQ32jKXbj2mwKXaaWxoVAUF8yKrQXGxz9xxODqF-y9Q93k550076; __Secure-3PSID=g.a000ygjGRZ3zEKx6r_v47HYiU6wdkepMvUJG62ahc3xd_WPPSP4Cke7BkaC3puUrdvzX0YHO3AACgYKAS8SARMSFQHGX2Mi85ZEVRavaYPA3lvq_Xl7DRoVAUF8yKrKCYKnLCV8edpqb7K1evW30076; LOGIN_INFO=AFmmF2swRQIhANmqttFBKBnyGPVFa9Er0WSzilqrJL_Xd811EGxpLLd0AiAj3Zu8LPuCSXEdGb2pvMOJJI897VQUPx9o8k_Tv1dWgg:QUQ3MjNmeV90dy1oVjBPMmF3U0lWal9RTzVOY251MDNfMFpDYWY5WURKUW0wRVZoZWhINzRBMVdRY2VlVng3bkQ4cHRiSEQwWF9XaWZHSnpIODF1dHhDY2VFLUtfcHBpZ3FOZ1RLRmhiNWRLcTNISi1GV1dmaUNlU2hJVlFtVUJkNUY2dXZVVmozZ0NfX216LUVPWEhCeXdnMEllWDNTb0NR; SIDCC=AKEyXzVfdpt5yUWHnOo9Oo4lzEp8p6fznM83YgQMWbg6t30926ZFKDMqqLa-eY9wcdLlKXrw; __Secure-1PSIDCC=AKEyXzW1hl5fzKzd8yIlKGLb2sIA5yBQWeC-ykJDVfjFREFkPZHIK01YrOINfI7D645Rzvkf; __Secure-3PSIDCC=AKEyXzV6XwaWGnZxgNutiw_U2iQjMcur5sh4PTNNJJ_0QNJbbMYgCOuABgXDyZYbo8H7iHf9;`;

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
