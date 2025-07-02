FROM node:18

WORKDIR /app

# Install yt-dlp
RUN apt-get update && apt-get install -y python3-pip ffmpeg && \
    pip install -U yt-dlp

COPY package.json ./
RUN npm install

COPY . .

ENV PORT=7860
EXPOSE 7860

CMD ["node", "index.js"]
