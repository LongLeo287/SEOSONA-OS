FROM node:22-slim

WORKDIR /app
ENV NODE_ENV=production

COPY apps/proxy/package.json ./package.json
RUN npm install --omit=dev

COPY apps/proxy/src ./src

EXPOSE 3000
CMD ["node", "src/server.js"]
