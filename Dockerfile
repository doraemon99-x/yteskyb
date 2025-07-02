FROM node:18-bullseye

# Install dependencies
RUN apt-get update && \
    apt-get install -y python3-pip ffmpeg curl && \
    pip install -U yt-dlp

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ENV PORT=7860
EXPOSE 7860

CMD ["node", "index.js"]
