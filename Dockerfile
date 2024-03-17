FROM node:18-alpine As development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine As production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
COPY --from=development /usr/src/app/dist ./dist
CMD [ "node", "dist/main.js" ]
