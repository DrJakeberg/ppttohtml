FROM node:20-bookworm-slim

ENV NODE_ENV=production
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends libreoffice-core libreoffice-impress \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src

RUN mkdir -p /app/data /app/uploads /app/converted \
  && chown -R node:node /app

USER node

ENV DATA_DIR=/app/data
ENV UPLOAD_DIR=/app/uploads
ENV CONVERTED_DIR=/app/converted
ENV PORT=3000

EXPOSE 3000
CMD ["npm", "start"]
