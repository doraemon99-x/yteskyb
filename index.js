import express from 'express';
import fetch from 'node-fetch';

const app = express();

// Paste cookie kamu dalam format 1 baris di sini:
const cookieHeader = `VISITOR_INFO1_LIVE=w3nOTln2uxs; VISITOR_PRIVACY_METADATA=CgJJRBIEGgAgbA%3D%3D; HSID=Ae8oYIuG1v-IzWQbR; SSID=AT7D0mEwg9c6jukkO; APISID=wvWpy9qR_july28H/Aq-zje66PHmVCelVk; SAPISID=wjs9sS7TppY46a-o/AOGYETxV3R320Grsd; __Secure-1PAPISID=wjs9sS7TppY46a-o/AOGYETxV3R320Grsd; __Secure-3PAPISID=wjs9sS7TppY46a-o/AOGYETxV3R320Grsd; LOGIN_INFO=AFmmF2swRQIhAPdu_aMolXK11t3tsmLErSuHU6f67zf-Iopu9-ICaU2YAiBvpXKxFp4B-QBRo4grFBN7703LTSWegjpOBkSw41o-eQ:QUQ3MjNmeVJNdG9yM0lBdEJfZ3lrazFwNEtXYVcwcVFveElBUlRDMXRGN21Ha0M1T0Z6Sjk2enlOam1XWkNQOUg4UjM2RzZOY1o0cmRDeUo5MXgzTUViRzFoNmtjWElEWEw2VTVycWEtS19HZDcyOEhJUTdaejNETm5MRF9VcFJzeFhKM3Y4OVA0MDNPXy0xWmdfLTdkUFk0NmI0dVpwd2hR; PREF=tz; SID=g.a000yAjGRR-XXfQR-xnyIlNts89yvc4QSI8mIznumDCt-34RWMT_6ujcpIZLQnu_PQxOTkFfGQACgYKAWESARMSFQHGX2MiFf5R4wU4N7u0Hwxl3rVWaBoVAUF8yKrAIrdKrC9lYLJalsDG9UbO0076; __Secure-1PSID=g.a000yAjGRR-XXfQR-xnyIlNts89yvc4QSI8mIznumDCt-34RWMT_dbwZp5nVHGH3L_uF2EeoaAACgYKAYkSARMSFQHGX2MiilUafbX5igoigecwAI-y8hoVAUF8yKpXoSHgQJrFrQCbOaM4UgXT0076; __Secure-3PSID=g.a000yAjGRR-XXfQR-xnyIlNts89yvc4QSI8mIznumDCt-34RWMT_GVpoU45NRIdfLdujaIB-yQACgYKAf4SARMSFQHGX2MiOERAV6vSEcpSMrtSsbHbnhoVAUF8yKr2__kjWUHV9Sul_7AmI8Eg0076; __Secure-ROLLOUT_TOKEN=CJz0haCQqdrOrwEQ8tmK9vPKigMYydmJ9s2ejgM%3D; __Secure-1PSIDTS=sidts-CjEB5H03P4yYAMqv6WYJFZsABGFe-eIz6M0Tta8FFVnr8hniRDn7z6XA2vYRGKRb-uIfEAA; __Secure-3PSIDTS=sidts-CjEB5H03P4yYAMqv6WYJFZsABGFe-eIz6M0Tta8FFVnr8hniRDn7z6XA2vYRGKRb-uIfEAA; SIDCC=AKEyXzUZJgVNG8csTDTsD15RIuD7m_jcmuUSimAwhR_0sxoxZ5USnzUKbEWM-FrwisnH6o5jlQ; __Secure-1PSIDCC=AKEyXzVhfK6CnXUaTH6PZrQ-ey99qDWnFRJyTEYc6a9bbA5Sr0ND4LDctdFMWjNPwtTwSsEEY9I; __Secure-3PSIDCC=AKEyXzXsQafC5no6WpXWPUc9gp2kMeU9jZzhBjJ1Vn-Rv36jVQdedO-jOs8feyDqS3w7KLKp2LU;`;

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
