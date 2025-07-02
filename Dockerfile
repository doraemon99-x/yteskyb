FROM node:18-bullseye

# Install yt-dlp dependencies
RUN apt-get update && \
    apt-get install -y python3-pip ffmpeg curl && \
    pip install -U yt-dlp

WORKDIR /app

# Salin dependencies dan install
COPY package.json ./
RUN npm install

# Salin seluruh source
COPY . .

# Hugging Face Spaces port
ENV PORT=7860
EXPOSE 7860

CMD ["node", "index.js"]
