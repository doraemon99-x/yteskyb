FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
RUN npm install

# Bundle app source
COPY . .

# Hugging Face Spaces port
ENV PORT=7860
EXPOSE 7860

CMD ["npm", "start"]
